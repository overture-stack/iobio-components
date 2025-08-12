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

import { estypes } from '@elastic/elasticsearch';
import * as zod from 'zod';

export type ScoreConfig = {
	scoreApiUrl: string;
	scoreApiDownloadPath: string;
};

/** Validation for Score Data response */
export const fileMetaDataSchema = zod.object({
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

export type FileMetaData = zod.infer<typeof fileMetaDataSchema>;

export type IndexFile = {
	object_id: string;
	name: string;
	file_type: string;
	md5sum: string;
	data_type: string;
	size: number;
	dataCategory: string;
};

export type FileDocument = {
	object_id: string;
	data_type?: string;
	file_access?: string;
	file_type?: string;
	analysis?: {
		collaborator?: {
			hits: {
				edges: [
					{
						node: {
							name: string;
						};
					},
				];
			};
		};
		experiment?: { experimentalStrategy: string; platform: string };
	};
	donors?: {
		hits: {
			edges: [
				{
					node: {
						submitter_donor_id: string;
					};
				},
			];
		};
	};
	file: {
		size: number;
		name: string;
		md5sum: string;
		data_type: string;
		index_file: IndexFile;
	};
};

export type ElasticSearchResult = estypes.GetGetResult<FileDocument>;

// Score API File Query
export type ScoreDownloadParams = {
	'User-Agent': string;
	external: string;
	length: string;
	offset: string;
};
