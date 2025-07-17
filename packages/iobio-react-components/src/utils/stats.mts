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
import { calculateMeanCoverage, getBamStatistics } from './functions.ts';

// Script Start
console.log('***** Overture Components: Iobio Metadata Generator *****');

const serverUrl = process.env.IOBIO_SERVER_URL;
const readlineInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const fileUrl = await readlineInterface.question('\nBam File URL: ');
if (!fileUrl) throw new Error('Alignment URL is required to generate statistics \nusage: pnpm run stats ${url}');

const indexUrl = await readlineInterface.question('\nIndex File URL (optional): ');
readlineInterface.close();

// Generate Statistics
const db = new DataBroker(fileUrl, { server: serverUrl });
db.indexUrl = indexUrl;

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
	const statistics = getBamStatistics(latestUpdate);
	const meanReadCoverage = calculateMeanCoverage(latestUpdate);
	statistics['mean_read_coverage'] = meanReadCoverage;

	console.log('statistics', statistics);

	// Output File
	const fileData = { statistics };
	const file = JSON.stringify(fileData);
	const sourceFileName = new URL(fileUrl).pathname.split('/').pop();
	const date = new Date().toISOString().split('T')[0];
	const fileName = `statistics-${sourceFileName}-${date}.json`;

	fs.writeFile(fileName, file, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`\nFile output to ${fileName}\n`);
		}
	});
});
