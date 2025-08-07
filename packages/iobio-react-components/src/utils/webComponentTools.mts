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

import { type FileDocument } from './scoreFileTypes.ts';

/**
 * Helper functions for Iobio Charts web component integrations
 */

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

/** File Strategy & Bed URL */
const fileStrategies = ['WGS', 'WXS', 'ChipSeq', 'RNA-Seq'];
type FileStrategyKey = (typeof fileStrategies)[number];
export type DefaultBedUrls = {
	[K in FileStrategyKey]: string;
};

// TODO: Finalize URLs after merge, these are just for testing
const bedShuffled1BrowserUrl =
	'https://raw.githubusercontent.com/overture-stack/iobio-components/29a2f8ec57ea8d38a00e998c52487b5aafe5095d/packages/iobio-react-components/src/utils/bedFiles/1k_flank_hg38_shuffled1.bed';
const bedShuffled2BrowserUrl =
	'https://raw.githubusercontent.com/overture-stack/iobio-components/29a2f8ec57ea8d38a00e998c52487b5aafe5095d/packages/iobio-react-components/src/utils/bedFiles/1k_flank_hg38_shuffled2.bed';
const bedIlluminaBrowserUrl =
	'https://raw.githubusercontent.com/overture-stack/iobio-components/29a2f8ec57ea8d38a00e998c52487b5aafe5095d/packages/iobio-react-components/src/utils/bedFiles/hg38_Twist_Bioscience_for_Illumina_Exome_2.5.subset.bed';

export const defaultBedUrls: DefaultBedUrls = {
	WGS: bedShuffled1BrowserUrl,
	WXS: bedShuffled2BrowserUrl,
	ChipSeq: bedShuffled2BrowserUrl,
	'RNA-Seq': bedIlluminaBrowserUrl,
};

/** Lookup Default Bed File
 * @param fileStrategy String file strategy designation for Bed file lookup
 * @returns bedFileUrl - string
 */
export const getDefaultBedFileUrl = (fileStrategy: string | undefined): string | undefined => {
	const isValidStrategy = fileStrategy && fileStrategies.includes(fileStrategy);
	if (!isValidStrategy) {
		console.error('File Strategy is not valid, cannot lookup recommended Bed file');
		return undefined;
	}
	const bedFileUrl = defaultBedUrls[fileStrategy];
	return bedFileUrl;
};

/** Helper to Lookup Default Bed File Url for documents with standard Score Analysis properties
 * @param elasticDocument Score FileDocument object
 * @returns bedFileUrl - string
 */
export const getBedUrlForEsDocument = (elasticDocument: FileDocument) => {
	const fileStrategy = elasticDocument.analysis?.experiment?.experimentalStrategy;
	return getDefaultBedFileUrl(fileStrategy);
};
