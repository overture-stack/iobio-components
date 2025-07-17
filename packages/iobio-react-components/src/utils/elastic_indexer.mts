/*
 *
 * Copyright (c) 2024 The Ontario Institute for Cancer Research. All rights reserved
 *
 *  This program and the accompanying materials are made available under the terms of
 *  the GNU Affero General Public License v3.0. You should have received a copy of the
 *  GNU Affero General Public License along with this program.
 *   If not, see <http://www.gnu.org/licenses/>.
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

// Config
const authKey = process.env.ES_AUTH_KEY;
const esHost = process.env.ES_HOST_URL;
if (!(authKey && esHost)) throw new Error('Required .env configuration values are missing');

// Definitions
const integer = 'integer';
const float = 'float';
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

const requestOptions = {
	headers: {
		Authorization: `ApiKey ${authKey}`,
	},
};

const updateMappingRequestOptions = {
	headers: {
		'Content-Type': 'application/json',
		...requestOptions.headers,
	},
	method: 'PUT',
	body: iobioProperties,
};

// Script Start
console.log('***** Overture Components: Iobio Metadata ElasticSearch Indexer *****');

// User Input
const readlineInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const index = await readlineInterface.question('\nElasticSearch Index: ');
const documentId = await readlineInterface.question('\nDocument Id: ');
readlineInterface.close();
if (!(index && documentId)) throw new Error('ElasticSearch index and documentId are required');

// Index Mapping
const mappingUrl = new URL(`${index}/_mapping`, esHost);
const indexResponse = await fetch(mappingUrl, requestOptions).then((response) => response.json());
const indexProperties = indexResponse[index]?.mappings.properties;
if (!indexProperties) throw new Error(`Error retrieving field mapping for ElasticSearch index ${index}`);

const hasIobioMapping = indexProperties.hasOwnProperty('iobio_metadata');
if (!hasIobioMapping) {
	console.log(`Updating Index ${index}`);
	await fetch(mappingUrl, updateMappingRequestOptions).then((response) => response.json());
}

// Generate Stats
// todo

// Update Document
// todo
