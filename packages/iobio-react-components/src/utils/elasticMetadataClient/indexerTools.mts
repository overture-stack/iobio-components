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

import readline from 'node:readline/promises';
import { BamFileExtensions } from '../constants.ts';
import { StatsOutput } from '../iobioTypes.ts';
import { generateIobioStats, type CompleteCallback } from '../statisticsClient/statisticsTools.mts';
import { getFileMetadata } from './scoreFileTools.mts';
import { type ElasticSearchResult } from './scoreFileTypes.ts';

/** Base ElasticSearch arguments */
export type EsConfig = {
	index: string;
	esHost: string;
	documentId: string;
	requestOptions: {
		headers: {
			Authorization: string;
		};
	};
};

const integer = 'integer';
const float = 'float';
/** ElasticSearch Field Mapping Template for iobio_metadata */
const iobioProperties = JSON.stringify({
	properties: {
		iobio_metadata: {
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
	},
});

/**
 * Confirm requested index exists, and add Iobio Field Mappings if needed
 * @param esConfig Base ElasticSearch arguments
 * @returns { Promise<void> }
 */
export const validateAndUpdateIndex = async (esConfig: EsConfig) => {
	const { index, esHost, requestOptions } = esConfig;
	const mappingUrl = new URL(`${index}/_mapping`, esHost);
	const indexResponse = await fetch(mappingUrl, requestOptions).then((response) => response.json());
	const indexProperties = indexResponse[index]?.mappings.properties;
	if (!indexProperties) throw new Error(`Error retrieving field mapping for ElasticSearch index ${index}`);

	const hasIobioMapping = indexProperties.hasOwnProperty('iobio_metadata');
	if (!hasIobioMapping) {
		updateIndexMapping(esConfig);
	}
};

/**
 * Add Iobio Metadata Fields to given Index Mapping
 * @param esConfig Base ElasticSearch config
 * @returns { Promise<void> }
 */
export const updateIndexMapping = async (esConfig: EsConfig) => {
	const { index, esHost, requestOptions } = esConfig;
	console.log(`Updating Index ${index}`);
	const mappingUrl = new URL(`${index}/_mapping`, esHost);
	const updateMappingRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
			...requestOptions.headers,
		},
		method: 'PUT',
		body: iobioProperties,
	};

	await fetch(mappingUrl, updateMappingRequestOptions).then((response) => response.json());
};

/**
 * Find a specific ElasticSearch Document with given object_id
 * @param esConfig Base ElasticSearch config
 * @returns { Promise<ElasticSearchResult> }
 */
export const searchDocument = async ({ index, documentId, esHost, requestOptions }: EsConfig) => {
	const searchUrl = new URL(`${index}/_search`, esHost);
	const searchQuery = JSON.stringify({
		query: {
			simple_query_string: {
				query: documentId,
				fields: ['object_id'],
			},
		},
	});

	const searchRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
			...requestOptions.headers,
		},
		method: 'POST',
		body: searchQuery,
	};

	const searchResponse = await fetch(searchUrl, searchRequestOptions).then((response) => response.json());
	const searchResult: ElasticSearchResult = searchResponse.hits.hits[0];

	if (searchResult === undefined) {
		throw new Error(`No document found with id ${documentId}`);
	}
	return searchResult;
};

/**
 * Get Score File URLs and additional File metadata from Elastic Document
 * @param esConfig Base ElasticSearch config
 * @param searchResult ElasticSearch Document
 * @returns { fileUrl, fileName, indexFileUrl }
 */
export const getFileDetails = async ({
	searchResult,
	esConfig,
}: {
	searchResult: ElasticSearchResult;
	esConfig: EsConfig;
}) => {
	const { documentId } = esConfig;
	const elasticDocument = searchResult._source;
	if (elasticDocument.file_type && !BamFileExtensions.includes(elasticDocument.file_type)) {
		throw new Error(`File is not a BAM or CRAM file, found extension ${elasticDocument.file_type}`);
	}

	const fileName = elasticDocument.file?.name;
	const { fileMetadata, indexFileMetadata } = await getFileMetadata(elasticDocument);
	const fileUrl = fileMetadata?.parts[0]?.url || null;
	if (!fileUrl) {
		throw new Error(`Unable to retrieve Score File URL for document with id: ${documentId}`);
	}
	const indexFileUrl = indexFileMetadata?.parts[0]?.url || null;

	return { fileUrl, fileName, indexFileUrl };
};

/**
 * Add Iobio Metadata to a specific Elastic Document
 * @param esConfig Base ElasticSearch config
 * @param iobio_metadata Generated Iobio Statistics data for the current file
 * @returns { Promise<void> }
 */
export const updateElasticDocument = async ({
	esConfig,
	iobio_metadata,
}: {
	esConfig: EsConfig;
	iobio_metadata: StatsOutput;
}) => {
	const { index, documentId, esHost, requestOptions } = esConfig;
	const updateUrl = new URL(`${index}/_update/${documentId}`, esHost);
	const updateBody = JSON.stringify({ doc: iobio_metadata });

	const updateDocumentRequestOptions = {
		headers: {
			'Content-Type': 'application/json',
			...requestOptions.headers,
		},
		method: 'POST',
		body: updateBody,
	};

	const updateResponse = await fetch(updateUrl, updateDocumentRequestOptions).then((response) => response.json());
	if (updateResponse.error) {
		throw new Error(updateResponse);
	}
	console.log(`Successfully updated document with id ${documentId}`);
};

/**
 * Elastic Indexing Utility Main CLI function
 * Captures User Input, Validates Index & Document, Updates Mapping if needed,
 * Generates Iobio Statistics, then updates the Document
 */
export const indexerCLI = async () => {
	const authKey = process.env.ES_AUTH_KEY;
	const esHost = process.env.ES_HOST_URL;
	if (!(authKey && esHost)) throw new Error('Required .env configuration values are missing');

	// Script Start
	console.log('***** Overture Components: Iobio Metadata ElasticSearch Indexer *****');

	// User Input
	const readlineInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});

	const index = await readlineInterface.question('\nElasticSearch Index: ');
	const documentId = await readlineInterface.question('Document Id: ');
	const outputOption = await readlineInterface.question('Output as JSON? (Y/N): ');
	const enableFileOutput = outputOption.toLowerCase() === 'y';
	readlineInterface.close();
	if (!(index && documentId)) throw new Error('ElasticSearch index and documentId are required');

	const requestOptions = {
		headers: {
			Authorization: `ApiKey ${authKey}`,
		},
	};
	const esConfig: EsConfig = { documentId, esHost, index, requestOptions };

	// Validate & Retrieve Data
	console.log('Validating Index');
	await validateAndUpdateIndex(esConfig);
	console.log('Retrieving Document');
	const searchResult = await searchDocument(esConfig);
	console.log('Getting Score File Data');
	const { fileUrl, fileName, indexFileUrl } = await getFileDetails({ esConfig, searchResult });

	// Iobio Data Broker relies on event listeners and executes this callback function when streaming is complete
	// This callback captures the statistics output and adds it to ElasticSearch
	const onComplete: CompleteCallback = async (iobio_metadata: StatsOutput) => {
		console.log('Updating Document');
		await updateElasticDocument({ iobio_metadata, esConfig });
	};

	console.log('Generating Iobio Statistics');
	await generateIobioStats({
		fileUrl,
		fileName,
		indexFileUrl,
		enableFileOutput,
		onComplete,
	});
};
