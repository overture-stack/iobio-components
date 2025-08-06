/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 * If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 */

import urlJoin from 'url-join';
import * as zod from 'zod';
import { type FileDocument, type FileMetaData, type ScoreDownloadParams } from './scoreFileTypes.ts';

const baseScoreDownloadParams: Omit<ScoreDownloadParams, 'length'> = {
	external: 'true',
	offset: '0',
	'User-Agent': 'unknown',
};

// Iobio File Properties
export const bamFileExtension = 'BAM';
export const cramFileExtension = 'CRAM';
export const BamFileExtensions = [bamFileExtension, cramFileExtension];

/** Type Checks for Score Data response */
export const FileMetaDataSchema = zod.object({
	objectId: zod.string(),
	objectKey: zod.string().optional(),
	objectMd5: zod.string().optional(),
	objectSize: zod.number().optional(),
	parts: zod.array(
		zod.object({
			md5: zod.string().nullable().optional(),
			offset: zod.number().optional(),
			partNumber: zod.number().optional(),
			partSize: zod.number().optional(),
			url: zod.string(),
		}),
	),
	uploadId: zod.string().optional(),
});

/** Request File from Score API */
export const getScoreFile = async ({
	length,
	object_id,
	scoreApiUrl,
	scoreApiDownloadPath,
}: {
	length: string;
	object_id: string;
	scoreApiUrl: string;
	scoreApiDownloadPath: string;
}): Promise<FileMetaData | undefined> => {
	if (!(scoreApiUrl && scoreApiDownloadPath)) {
		throw new Error('Score API URL is missing in .env');
	}
	const scoreDownloadParams: ScoreDownloadParams = {
		...baseScoreDownloadParams,
		length,
	};
	const urlParams = new URLSearchParams(scoreDownloadParams).toString();
	try {
		const scoreUrl = urlJoin(scoreApiUrl, scoreApiDownloadPath, object_id, `?${urlParams}`);
		const response = await fetch(scoreUrl, {
			headers: { accept: '*/*' },
		});

		if (response.status === 200) {
			return response.json();
		}
	} catch (err: unknown) {
		console.error(`Error at getScoreFile with object_id ${object_id}`);
		console.error(err);
	}
};

/** Get required properties for Score Download */
export const getFileMetadata = async (
	selectedFile: FileDocument,
	scoreApiUrl: string,
	scoreApiDownloadPath: string,
) => {
	/* Base BAM/CRAM File download */
	const fileObjectId = selectedFile.object_id;
	const fileData = selectedFile.file;
	const fileSize = fileData.size.toString();
	const scoreFileMetadata = await getScoreFile({
		length: fileSize,
		object_id: fileObjectId,
		scoreApiUrl,
		scoreApiDownloadPath,
	});
	if (!FileMetaDataSchema.safeParse(scoreFileMetadata))
		throw new Error(`Unable to retrieve Score File with object_id: ${fileObjectId}`);

	/**  Related Index File download */
	const { object_id: indexObjectId, size: indexFileSize } = fileData.index_file;
	const indexFileMetadata = await getScoreFile({
		length: indexFileSize.toString(),
		object_id: indexObjectId,
		scoreApiUrl,
		scoreApiDownloadPath,
	});
	if (!FileMetaDataSchema.safeParse(indexFileMetadata))
		console.error(`Error retrieving Index file from Score with object_id: ${fileObjectId}, results may be inaccurate`);

	return { scoreFileMetadata, indexFileMetadata };
};
