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

import { percentKeys } from './constants.ts';

const db = new DataBroker('https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam');

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

	console.log(latestUpdate);

	const statistics = percentKeys.reduce((acc, val) => {
		const stats = { ...acc, [val]: latestUpdate[val] };
		return stats;
	}, {});

	console.log(statistics);

	const file = JSON.stringify(latestUpdate);

	fs.writeFile('NA12878.autsome.bam.json', file, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log('\n File output to NA12878.autsome.bam.json \n');
		}
	});
});
