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

import {
	BamHistogramKey,
	BamPercentKey,
	histogramKeys,
	percentKeys,
	StatisticKey,
	statisticKeys,
} from './constants.ts';

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

type StatisticsData = { [K in StatisticKey]: number };
type PercentData = { [K in BamPercentKey]: number };
type HistogramData = { [K in BamHistogramKey]: number };

type DataUpdate = StatisticsData & PercentData;

export const getBamStatistics = (dataEvent: DataUpdate) => {
	return [...percentKeys, ...statisticKeys].reduce((acc, val) => {
		const value = dataEvent[val];
		const stats: { [k: string]: number } = { ...acc, [val]: value };

		if (percentKeys.some((percentKey) => percentKey === val)) {
			const percentage = Number((value / dataEvent['total_reads']).toPrecision(4));
			const key = `${val}_percentage`;
			stats[key] = percentage;
		}
		return stats;
	}, {});
};

export const getHistogramData = (dataEvent: HistogramData) => {
	const histogramData = [...histogramKeys].reduce((acc, val) => {
		const value: number = dataEvent[val];
		const stats: { [k in BamHistogramKey]: number } = { ...acc, [val]: value };
		return stats;
	}, {} as HistogramData);

	return histogramData;
};
