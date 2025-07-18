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

import { DataBroker } from 'iobio-charts/data_broker.js';
import fs from 'node:fs';
import readline from 'node:readline/promises';
import { calculateMeanCoverage, getBamStatistics } from './iobioHelpers.ts';
import { type StatsOutput } from './iobioTypes.ts';

export type CompleteCallback = (stats: StatsOutput) => Promise<void>;

export const generateIobioStats = async ({
	fileUrl,
	fileName,
	indexFileUrl = '',
	enableFileOutput = false,
	onComplete,
}: {
	fileUrl: string;
	fileName?: string;
	indexFileUrl?: string | null;
	enableFileOutput?: boolean;
	onComplete?: CompleteCallback | null;
}) => {
	// Generate Statistics
	const serverUrl = process.env.IOBIO_SERVER_URL;
	const db = new DataBroker(fileUrl, { server: serverUrl });
	if (indexFileUrl) db.indexUrl = indexFileUrl;

	const data: any[] = [];

	db.addEventListener('stats-stream-start', () => {
		console.log('Streaming started');
	});

	db.addEventListener('stats-stream-data', (event: any) => {
		process.stdout.write('*');
		data.push(event.detail);
	});

	db.addEventListener('stats-stream-end', () => {
		console.log('\nStreaming ended \n');

		// Finalize Data
		const latestUpdate = data[data.length - 1];
		const iobio_metadata = getBamStatistics(latestUpdate);
		const meanReadCoverage = calculateMeanCoverage(latestUpdate);
		iobio_metadata['mean_read_coverage'] = meanReadCoverage;

		console.log('Statistics:', iobio_metadata);

		// Output File
		const fileData: StatsOutput = { iobio_metadata };
		const urlFileName = new URL(fileUrl).pathname.split('/').pop();
		const date = new Date().toISOString().split('T')[0];
		const outputFileName = fileName ? `statistics-${fileName}-${date}.json` : `statistics-${urlFileName}-${date}.json`;

		if (enableFileOutput) outputFile(outputFileName, fileData);
		if (onComplete) onComplete(fileData);
	});
};

export const outputFile = (fileName: string, fileData: StatsOutput) => {
	// Output File
	const file = JSON.stringify(fileData);
	fs.writeFile(fileName, file, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`\nFile output to ${fileName}\n`);
		}
	});
};

export const statisticsCLI = async () => {
	const readlineInterface = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	console.log('***** Overture Components: Iobio Metadata Generator *****');

	const fileUrl = await readlineInterface.question('\nBam File URL: ');
	if (!fileUrl) throw new Error('Alignment URL is required to generate statistics \nusage: pnpm run stats ${url}');

	const indexFileUrl = await readlineInterface.question('\nIndex File URL (optional): ');
	const outputOption = await readlineInterface.question('\nOutput as JSON? (Y/N): ');
	const enableFileOutput = outputOption.toLowerCase() === 'y';
	readlineInterface.close();

	generateIobioStats({ fileUrl, indexFileUrl, enableFileOutput });
};
