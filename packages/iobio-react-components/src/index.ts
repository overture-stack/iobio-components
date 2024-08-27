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

import { default as IobioCoverageDepth, IobioCoverageDepthType } from './coverage_depth';
import { default as IobioDataBroker, IobioDataBrokerType } from './data_broker';
import { default as IobioHistogram, IobioHistogramType } from './histogram';
import { default as IobioPercentBox, IobioPercentBoxType } from './percent_box';

import { BamDisplayNames, BamKeys, histogramKeys, percentKeys } from './constants';

type IobioComponents = {
	IobioCoverageDepth: IobioCoverageDepthType;
	IobioDataBroker: IobioDataBrokerType;
	IobioHistogram: IobioHistogramType;
	IobioPercentBox: IobioPercentBoxType;
	// TODO: consistent key naming
	BamDisplayNames: typeof BamDisplayNames;
	BamKeys: typeof BamKeys;
	histogramKeys: typeof histogramKeys;
	percentKeys: typeof percentKeys;
};

const iobio = () => {
	import('iobio-charts');

	return {
		IobioCoverageDepth,
		IobioDataBroker,
		IobioHistogram,
		IobioPercentBox,
		BamDisplayNames,
		BamKeys,
		histogramKeys,
		percentKeys,
	} as IobioComponents;
};

export default iobio;

export { type IobioCoverageDepthType } from './coverage_depth';
export { type IobioDataBrokerType } from './data_broker';
export { type IobioHistogramType } from './histogram';
export { type IobioPercentBoxType } from './percent_box';

export { type BamHistogramKey, type BamKey, type BamPercentKey } from './constants';
