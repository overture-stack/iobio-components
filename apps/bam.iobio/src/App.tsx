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

import clsx from 'clsx';
import IobioComponents from 'components';
import { useEffect, useState } from 'react';
import './App.css';
import {
	BamContext,
	BamDataKeys,
	BamDisplayNames,
	BamKey,
	defaultBamContext,
	histogramKeys,
	ignoreOutlierKeys,
	iobioURL,
	percentKeys,
} from './util';

const { IobioCoverageDepth, IobioDataBroker, IobioHistogram, IobioPercentBox } = IobioComponents;

const colors = ['red', 'orange', 'gold', 'aquamarine', 'cornflowerblue'];

const bamConfigPanel = (bamContext: BamContext, updateContext: (key: BamKey, value: boolean) => void) => (
	<div style={{ margin: '15px' }}>
		{BamDataKeys.map((key) => {
			return (
				<button
					className={clsx('config-button', bamContext[key] && 'active')}
					key={key}
					onClick={() => {
						updateContext(key, bamContext[key]);
					}}
				>
					{BamDisplayNames[key]}
				</button>
			);
		})}
	</div>
);

const bamFileStats = (bamFile: string | null) => {
	const { max = '' } = bamFile ? JSON.parse(bamFile) : {};
	return (
		<div className="file-stats">
			<h4>File Stats</h4>
			<p>Max Read Coverage: {max}</p>
			<p>Detail 2</p>
		</div>
	);
};

function App() {
	const fileLoaded = Boolean(window.location.search);

	const localBamConfig = localStorage.getItem('bamConfig') || null;

	const [bamContext, setBamContext] = useState(localBamConfig ? JSON.parse(localBamConfig) : defaultBamContext);

	const [bamFile, setBamFile] = useState<string | null>(null);

	const [showBam, toggleShowBam] = useState(true);

	const updateContext = (key: keyof BamContext, value: boolean) => {
		const newContext = {
			...bamContext,
			[key]: !value,
		};
		setBamContext(newContext);
	};

	useEffect(() => {
		localStorage.setItem('bamConfig', JSON.stringify(bamContext));
	}, [bamContext]);

	useEffect(() => {
		const fileStats = localStorage.getItem('bamFileStats');
		setBamFile(fileStats);
	}, [fileLoaded]);

	return (
		<div className="App">
			<header className={clsx('App-header', fileLoaded ? 'file-loaded' : 'home')}>
				<img src="ov-logo.png" className="App-logo" />
				<h2>Overture Iobio Components</h2>

				{fileLoaded && (
					<a className="Back-button" href={'/'}>
						Back
					</a>
				)}
			</header>
			{fileLoaded ? bamFileStats(bamFile) : bamConfigPanel(bamContext, updateContext)}

			<button className={clsx('config-button', showBam && ' active')} onClick={() => toggleShowBam(!showBam)}>
				Show / Hide BAM
			</button>

			<div className={clsx('bam-container', showBam && 'bam-open')}>
				<div id="app"></div>
				{showBam ? (
					<>
						<h3>Bam.Iobio</h3>

						<IobioDataBroker alignmentUrl={iobioURL} />

						{/* Percent Boxes */}
						<div className="row iobio-container">
							{percentKeys.map(
								(key) =>
									bamContext[key] && (
										<IobioPercentBox title={BamDisplayNames[key]} percentKey={key} totalKey="total_reads" key={key} />
									),
							)}
						</div>

						{/* Coverage Depth */}
						{bamContext.coverage_depth && (
							<div className="row iobio-chart-container">
								<IobioCoverageDepth />
							</div>
						)}

						{/* Histograms */}
						{histogramKeys.map((key, index) => {
							const ignoreOutliers = ignoreOutlierKeys.includes(key) ? { ignoreOutliers: true } : {};
							return (
								bamContext[key] && (
									<div key={key} className="row iobio-chart-container">
										<IobioHistogram
											key={key}
											brokerKey={key}
											title={BamDisplayNames[key]}
											color={colors[index]}
											{...ignoreOutliers}
										/>
									</div>
								)
							);
						})}
					</>
				) : null}
			</div>
		</div>
	);
}

export default App;
