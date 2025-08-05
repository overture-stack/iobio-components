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
import readline from 'node:readline/promises';
import { type StatsOutput } from '../iobioTypes.ts';
import { generateIobioStats, type CompleteCallback } from '../statisticsGenerator/statisticsTools.mts';
import {
	getFileDetails,
	searchDocument,
	updateElasticDocument,
	validateAndUpdateIndex,
	type EsConfig,
} from './indexerTools.mts';

/**
 * Elastic Indexing Utility Main CLI function
 * Captures User Input, Validates Index & Document, Updates Mapping if needed,
 * Generates Iobio Statistics, then updates the Document
 */

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

const client = new Client({
	node: esHost,
	auth: {
		apiKey: authKey,
	},
});
const esConfig: EsConfig = { client, documentId, index };

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
