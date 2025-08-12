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

export { default as IobioCoverageDepth } from './components/coverageDepth';
export { default as IobioDataBroker } from './components/dataBroker';
export { default as IobioHistogram } from './components/histogram';
export { default as IobioLabelInfoButton } from './components/labelInfoButton';
export { default as IobioPanel } from './components/panel';
export { default as IobioPercentBox } from './components/percentBox';

export * from './utils/constants';
export { getFileMetadata } from './utils/scoreFileTools.mts';
export * from './utils/scoreFileTypes.ts';
export * from './utils/webComponentTools.mts';

// Init Iobio Charts
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import#import_a_module_for_its_side_effects_only
// Multiple Iobio Charts imports can trigger errors in related DOM APIs.
// This "lazy loading" prevents setups like NextJS from doing that, by importing only client-side.

(async () => {
	await import('iobio-charts');
})();
