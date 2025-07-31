/*
 *
 *  Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 *  EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 *  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 *  SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 *  TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 *  OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 *  IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import urlJoin from 'url-join';
import { type FileDocument, type FileMetaData, type FileResponse, type ScoreDownloadParams } from './scoreFileTypes.ts';

const baseScoreDownloadParams: Omit<ScoreDownloadParams, 'length'> = {
	external: 'true',
	offset: '0',
	'User-Agent': 'unknown',
};

/** Type Checks for Score Data response */
export const isFileMetaData = (file: unknown): file is FileMetaData => {
	return (
		typeof (file as FileMetaData)?.objectId === 'string' && typeof (file as FileMetaData)?.parts[0]?.url === 'string'
	);
};

export const isFileResponse = (response: unknown): response is FileResponse => {
	return typeof (response as FileResponse)?.data?.file.hits === 'object';
};

/** Request File from Score API */
export const getScoreFile = async ({
	length,
	object_id,
}: {
	length: string;
	object_id: string;
}): Promise<FileMetaData | undefined> => {
	const { SCORE_API_URL, SCORE_API_DOWNLOAD_PATH } = process.env;
	if (!(SCORE_API_URL && SCORE_API_DOWNLOAD_PATH)) throw new Error('Score API URL is missing in .env');
	const scoreDownloadParams: ScoreDownloadParams = {
		...baseScoreDownloadParams,
		length,
	};
	const urlParams = new URLSearchParams(scoreDownloadParams).toString();
	try {
		const scoreUrl = urlJoin(SCORE_API_URL, SCORE_API_DOWNLOAD_PATH, object_id, `?${urlParams}`);
		const response = (await fetch(scoreUrl)).json();

		return response;
	} catch (err: unknown) {
		console.error(`Error at getScoreFile with object_id ${object_id}`);
		throw err;
	}
};

/** Get required properties for Score Download */
export const getFileMetadata = async (
	selectedFile: FileDocument,
): Promise<{ fileMetadata: FileMetaData; indexFileMetadata: FileMetaData | undefined }> => {
	// Base BAM/CRAM File download
	const fileObjectId = selectedFile.object_id;
	const fileData = selectedFile.file;
	const fileSize = fileData.size.toString();
	const fileMetadata = await getScoreFile({ length: fileSize, object_id: fileObjectId });
	if (!isFileMetaData(fileMetadata)) {
		throw new Error(`Unable to retrieve Score File with object_id: ${fileObjectId}`);
	}

	/**  Related Index File download */
	const { object_id: indexObjectId, size: indexFileSize } = fileData.index_file;
	const indexFileMetadata = await getScoreFile({ length: indexFileSize.toString(), object_id: indexObjectId });
	if (!isFileMetaData(indexFileMetadata)) {
		console.error(`Error retrieving Index file from Score with object_id: ${fileObjectId}, results may be inaccurate`);
	}

	return { fileMetadata, indexFileMetadata };
};
