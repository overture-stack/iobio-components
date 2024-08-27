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

import fs from 'fs';

// Requires Node 19
import { DataBroker } from 'iobio-charts/data_broker.js';

import { calculateMeanCoverage, getBamStatistics } from './utils.ts';

const fileUrl = 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam';

const db = new DataBroker(fileUrl);

const data: any[] = [];

db.addEventListener('stats-stream-start', () => {
	console.log('Streaming started');
});

db.addEventListener('stats-stream-data', (evt: any) => {
	console.log(evt.detail);
	data.push(evt.detail);
});

db.addEventListener('stats-stream-end', () => {
	console.log('\n Streaming ended \n');

	const latestUpdate = data[data.length - 1];

	const statistics = getBamStatistics(latestUpdate);

	const meanReadCoverage = calculateMeanCoverage(latestUpdate);
	statistics['mean_read_coverage'] = meanReadCoverage;

	const fileData = { statistics };

	const file = JSON.stringify(fileData);

	const fileName = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);

	fs.writeFile(`${fileName} statistics.json`, file, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`\n File output to ${fileName} statistics.json \n`);
		}
	});
});
