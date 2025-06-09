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

import fs from 'node:fs';

import { DataBroker } from 'iobio-charts/data_broker.js';

import { calculateMeanCoverage, getBamStatistics } from './index.ts';

// TODO: Add env support
const fileUrl = process.argv[2];
const options = {
	indexUrl: process.argv[3],
};

if (!fileUrl) throw new Error('No File URL passed in arguments \nusage: pnpm run stats ${url}');

const db = new DataBroker(fileUrl, options);

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

	const latestUpdate = data[data.length - 1];

	// TODO: Handle latestUpdate undefined
	const statistics = getBamStatistics(latestUpdate);

	const meanReadCoverage = calculateMeanCoverage(latestUpdate);
	statistics['mean_read_coverage'] = meanReadCoverage;

	console.log('statistics', statistics);

	const fileData = { statistics };

	const file = JSON.stringify(fileData);

	// TODO: Update to fit different urls
	// Use URL() to parse, similar to data_broker
	const sourceFileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1).split('?')[0];

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
