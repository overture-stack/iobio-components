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

import {
	histogramKeys,
	ignoreOutlierKeys,
	percentKeys,
	statisticKeys,
	type BamKey,
	type BamOutlierKey,
	type BamPercentKey,
	type percentageStatsKey,
} from './constants.ts';
import { type DataUpdate, type HistogramData } from './iobioTypes.ts';

export const isOutlierKey = (key: BamKey): key is BamOutlierKey => {
	return ignoreOutlierKeys.includes(key as BamOutlierKey);
};

/**
 * Formats Boolean React Props to native HTML style where the element only checks if it 'has' the property or not
 * False values are removed, truthy values returned as { key: boolean }
 * @param booleanAttributes
 * @returns { key: boolean }
 */
export const getBooleanAttributes = (booleanAttributes: { [key: string]: boolean }) => {
	return Object.keys(booleanAttributes)
		.filter((attribute) => booleanAttributes[attribute])
		.reduce((acc, key) => {
			return { ...acc, [key]: booleanAttributes[key] };
		}, {});
};

/**
 * Take React Style object and apply it to Web Component Shadow Dom as style sheet
 * Allows adding custom styles to nested elements
 * @param element DOM Node
 * @param styles CSS String
 */
export const setElementStyles = (element: Element, styles: string) => {
	if (element?.shadowRoot) {
		const elementStyles = new CSSStyleSheet();
		elementStyles.replaceSync(styles);
		element.shadowRoot.adoptedStyleSheets = [elementStyles];
	}
};

/**
 * Obtain BAM statistical data from Data Broker data events
 * @param dataEvent { [BamKey]: number  }
 */
export const getBamStatistics = (dataEvent: DataUpdate) => {
	return [...percentKeys, ...statisticKeys].reduce(
		(statsData, dataKey) => {
			const value = dataEvent[dataKey];
			const stats: { [k in BamKey]: number } = { ...statsData, [dataKey]: value };

			const isPercentKey = (key: keyof DataUpdate): key is BamPercentKey =>
				percentKeys.some((percentKey) => percentKey === key);

			if (isPercentKey(dataKey)) {
				const percentage = Number((value / dataEvent['total_reads']).toPrecision(4));
				const displayKey: percentageStatsKey = `${dataKey}_percentage`;
				stats[displayKey] = percentage;
			}
			return stats;
		},
		{} as { [k in BamKey]: number },
	);
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

/**
 * Obtain Mean Read Coverage from Coverage Histogram data
 * Src: iobio-charts/coverage/src/BamViewChart.js L259
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
