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

import { Client } from '@elastic/elasticsearch';

import { bamFileExtensions } from '../constants.ts';
import { type StatsOutput } from '../iobioTypes.ts';
import { getFileMetadata } from '../scoreFileTools.mts';
import { type ElasticSearchResult, type FileDocument, type ScoreConfig } from '../scoreFileTypes.ts';

/** Base ElasticSearch arguments */
export type EsConfig = {
	client: Client;
	index: string;
	documentId: string;
};

/** ElasticSearch Field Mapping Template for iobio_metadata */
const integer = 'integer';
const float = 'float';
const iobioMappingProperties = {
	iobio_metadata: {
		type: 'nested',
		properties: {
			mapped_reads: { type: integer },
			mapped_reads_percentage: { type: float },
			forward_strands: { type: integer },
			forward_strands_percentage: { type: float },
			proper_pairs: { type: integer },
			proper_pairs_percentage: { type: float },
			singletons: { type: integer },
			singletons_percentage: { type: float },
			both_mates_mapped: { type: integer },
			both_mates_mapped_percentage: { type: float },
			duplicates: { type: integer },
			duplicates_percentage: { type: float },
			failed_qc: { type: integer },
			first_mates: { type: integer },
			last_read_position: { type: integer },
			paired_end_reads: { type: integer },
			reverse_strands: { type: integer },
			second_mates: { type: integer },
			total_reads: { type: integer },
			mean_read_coverage: { type: integer },
		},
	},
} as const;

/**
 * Confirm requested index exists, and add Iobio Field Mappings if needed
 * No return value if successful, throws error when index does not exist or on conflict with ElasticSearch
 * @param esConfig Base ElasticSearch arguments
 */
export const validateAndUpdateIndex = async (esConfig: EsConfig): Promise<void> => {
	const { client, index } = esConfig;
	const indexResponse = await client.indices.getMapping({ index });
	const indexProperties = indexResponse[index]?.mappings.properties;
	if (!indexProperties) throw new Error(`Error retrieving field mapping for ElasticSearch index ${index}`);

	const hasIobioMapping = indexProperties.hasOwnProperty('iobio_metadata');
	if (!hasIobioMapping) {
		await updateIndexMapping(esConfig);
	}
};

/**
 * Add Iobio Metadata Fields to given Index Mapping
 * @param esConfig Base ElasticSearch config
 */
export const updateIndexMapping = async ({ client, index }: EsConfig): Promise<void> => {
	console.log(`Updating Index ${index}`);
	await client.indices
		.putMapping({
			index,
			properties: iobioMappingProperties,
		})
		.catch((error) => {
			throw new Error(`Error updating index: ${index}`, error);
		});
};

/**
 * Find a specific ElasticSearch Document with given object_id
 * @param esConfig Base ElasticSearch config
 */
export const searchDocument = async ({ client, index, documentId }: EsConfig): Promise<ElasticSearchResult> => {
	return await client.get<FileDocument>({ index, id: documentId });
};

/**
 * Get Score File URLs and additional File metadata from Elastic Document
 * @param esConfig Base ElasticSearch config
 * @param searchResult ElasticSearch Document
 */
export const getFileDetails = async ({
	elasticDocument,
	esConfig,
	scoreConfig,
}: {
	elasticDocument: FileDocument;
	esConfig: EsConfig;
	scoreConfig: ScoreConfig;
}): Promise<{ fileUrl: string; fileName?: string; indexFileUrl?: string }> => {
	const { documentId } = esConfig;
	if (elasticDocument.file_type && !bamFileExtensions.includes(elasticDocument?.file_type)) {
		throw new Error(`File is not a BAM or CRAM file, found extension ${elasticDocument.file_type}`);
	}

	const { scoreApiDownloadPath, scoreApiUrl } = scoreConfig;
	const fileName = elasticDocument.file?.name;
	const { scoreFileMetadata, indexFileMetadata } = await getFileMetadata(
		elasticDocument,
		scoreApiUrl,
		scoreApiDownloadPath,
	);
	const fileUrl = scoreFileMetadata?.parts[0]?.url || null;
	if (!fileUrl) {
		throw new Error(`Unable to retrieve Score File URL for document with id: ${documentId}`);
	}
	const indexFileUrl = indexFileMetadata?.parts[0]?.url;

	return { fileUrl, fileName, indexFileUrl };
};

/**
 * Add Iobio Metadata to a specific Elastic Document
 * @param esConfig Base ElasticSearch config
 * @param iobio_metadata Generated Iobio Statistics data for the current file
 */
export const updateElasticDocument = async ({
	esConfig,
	iobio_metadata,
}: {
	esConfig: EsConfig;
	iobio_metadata: StatsOutput;
}): Promise<void> => {
	const { client, index, documentId } = esConfig;
	await client.update({ index, id: documentId, doc: iobio_metadata }).catch((error) => {
		throw new Error(`Error Updating document with id: ${documentId}`, error);
	});

	console.log(`Successfully updated document with id ${documentId}`);
};
