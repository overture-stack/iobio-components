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
import iobioCharts from 'iobio-charts';
import components from './index';

declare module 'iobio-charts' {
	export declare function createPercentBox(): typeof iobioCharts.createPercentBox;
	export declare function createHistogram(): typeof iobioCharts.createHistogram;
	export declare const PercentBoxElement: typeof iobioCharts.PercentBoxElement;
	export declare const HistogramElement: typeof iobioCharts.HistogramElement;
	export declare const DataBroker: typeof iobioCharts.DataBroker;
	export declare const DataBrokerElement: typeof iobioCharts.DataBrokerElement;
}

declare module '@overture-stack/iobio-components/components';

export declare function createPercentBox(): typeof components.createPercentBox;
export declare function createHistogram(): typeof components.createHistogram;
export declare const PercentBoxElement: typeof components.PercentBoxElement;
export declare const HistogramElement: typeof components.HistogramElement;
