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

import { DataBroker } from 'iobio-charts/data_broker.js';
import fs from 'node:fs';
import { histogramKeys, isPercentKey, percentKeys, statisticKeys, type PercentageStatsKey } from '../constants.ts';
import { IobioMetaData, type DataUpdate, type HistogramData, type StatsOutput } from '../iobioTypes.ts';
percentKeys;

export type CompleteCallback = (stats: StatsOutput) => Promise<void>;

/**
 * Obtain Mean Read Coverage from Coverage Histogram data
 * Src: iobio-charts/coverage/src/BamViewChart.js L259
 * @param dataEvent { [BamKey]: number  }
 */

export const calculateMeanCoverage = (dataEvent: HistogramData) => {
	const coverageData = dataEvent.coverage_hist;

	let coverageMean = 0;
	for (const coverage in coverageData) {
		const freq = coverageData[coverage];
		const coverageVal = parseInt(coverage);

		coverageMean += coverageVal * freq;
	}
	const meanCoverage = Math.floor(coverageMean);

	return meanCoverage;
};

/**
 * Obtain BAM statistical data from Data Broker data events
 * @param dataEvent { [BamKey]: number  }
 */
export const getBamStatistics = (dataEvent: DataUpdate) => {
	return [...percentKeys, ...statisticKeys].reduce((statsData, dataKey) => {
		const value = dataEvent[dataKey];
		const stats: IobioMetaData = { ...statsData, [dataKey]: value };

		if (isPercentKey(dataKey)) {
			const percentage = Number((value / dataEvent['total_reads']).toPrecision(4));
			const displayKey: PercentageStatsKey = `${dataKey}_percentage`;
			stats[displayKey] = percentage;
		}
		return stats;
	}, {} as IobioMetaData);
};

/**
 * Obtain BAM Histogram data from Data Broker data events
 * @param dataEvent { [K in BamHistogramKey]: { [numKey: string]: number } }
 * where numKey parses to an Integer
 */

export const getHistogramData = (dataEvent: HistogramData) => {
	const histogramData = histogramKeys.reduce((statsData, dataKey) => {
		const value = dataEvent[dataKey];
		const stats: HistogramData = { ...statsData, [dataKey]: value };
		return stats;
	}, {} as HistogramData);

	return histogramData;
};

/** Generate Iobio metadata using data broker
 * @param fileUrl Url for the BAM/CRAM file to target
 * @param fileName Name of target read file, added to output JSON file name
 * @param indexFileUrl Url for the index file related to the target BAM. Optional
 * @param enableFileOutput Enable/Disable writing a JSON file with metadata contents
 * @param onComplete Callback function for when stats-stream finishes. Used to pass stats data to another process. Optional
 */
export const generateIobioStats = async ({
	fileUrl,
	fileName,
	indexFileUrl = '',
	serverUrl = '',
	enableFileOutput = false,
	onComplete,
}: {
	fileUrl: string;
	fileName?: string;
	indexFileUrl?: string;
	serverUrl?: string;
	enableFileOutput?: boolean;
	onComplete?: CompleteCallback | null;
}): Promise<void> => {
	// Generate Statistics
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

		if (enableFileOutput) {
			const urlFileName = new URL(fileUrl).pathname.split('/').pop();
			const date = new Date().toISOString().split('T')[0];
			const outputFileName = fileName
				? `iobio-metadata-${fileName}-${date}.json`
				: `iobio-metadata-${urlFileName}-${date}.json`;
			outputFile(outputFileName, fileData);
		}

		if (onComplete) {
			onComplete(fileData);
		}
	});
};

/** Write Iobio Metadata as a JSON File
 * @param fileName Output JSON file name
 * @param fileData Iobio Metadata to write to file
 */
export const outputFile = (fileName: string, fileData: StatsOutput): void => {
	const file = JSON.stringify(fileData);
	fs.writeFile(fileName, file, (err) => {
		if (err) {
			console.error(err);
		} else {
			console.log(`\nFile output to ${fileName}\n`);
		}
	});
};
