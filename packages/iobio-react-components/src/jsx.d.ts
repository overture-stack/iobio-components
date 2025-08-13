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

import { type DetailedHTMLProps, type HTMLAttributes, type PropsWithChildren } from 'react';
export interface IobioElementAttributes extends HTMLAttributes<HTMLElement> {
	styles?: string;
	label?: string;
}
export interface IobioDataBrokerAttributes extends IobioElementAttributes {
	'alignment-url': string;
	'index-url'?: string;
	'file-format'?: string;
	server?: string;
}

type CoverageDepthProps = DetailedHTMLProps<IobioElementAttributes, HTMLElement>;
type DataBrokerProps = DetailedHTMLProps<IobioDataBrokerAttributes, HTMLElement>;
type HistogramProps = DetailedHTMLProps<IobioElementAttributes, HTMLElement>;
type LabelInfoButtonProps = DetailedHTMLProps<PropsWithChildren<IobioElementAttributes>, HTMLElement>;
type PanelProps = DetailedHTMLProps<PropsWithChildren<IobioElementAttributes>, HTMLElement>;
type LabelInfoButtonProps = DetailedHTMLProps<PropsWithChildren<IobioElementAttributes>, HTMLElement>;
type PercentBoxProps = DetailedHTMLProps<PropsWithChildren<IobioElementAttributes>, HTMLElement>;

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'iobio-coverage-depth': CoverageDepthProps;
			'iobio-data-broker': DataBrokerProps;
			'iobio-histogram': HistogramProps;
			'iobio-label-info-button': LabelInfoButtonProps;
			'iobio-panel': PanelProps;
			'iobio-percent-box': PercentBoxProps;
		}
	}
}
