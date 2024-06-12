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

import { createHistogram, createPercentBox } from '@overture-stack/iobio-components/components';
import { useEffect, useState } from 'react';
import './App.css';

const defaultBamContext = {
	percentBox: true,
	histogram: true,
};

type BamContext = typeof defaultBamContext;

const bamConfigPanel = (bamContext: BamContext, updateContext: (key: keyof BamContext, value: boolean) => void) => {
	const { percentBox, histogram } = bamContext;

	return (
		<div style={{ margin: '15px' }}>
			<button
				className={'config-button' + (percentBox ? ' active' : '')}
				onClick={() => {
					updateContext('percentBox', percentBox);
				}}
			>
				Pie Chooser
			</button>
			<button
				className={'config-button' + (histogram ? ' active' : '')}
				onClick={() => {
					updateContext('histogram', histogram);
				}}
			>
				Read Coverage
			</button>
		</div>
	);
};

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

	// Init
	createPercentBox();
	createHistogram();

	const randomNum10 = () => Math.round(Math.random() * 10);

	const randomizeChart = () => {
		const randomNumA = randomNum10();
		const randomNumB = randomNum10();

		return [randomNumA, randomNumB];
	};

	const randomizeHistogram = () => {
		const dataA = [randomNum10(), randomNum10()];
		const dataB = [randomNum10(), randomNum10()];
		const dataC = [randomNum10(), randomNum10()];
		const dataD = [randomNum10(), randomNum10()];

		const dataA1 = [randomNum10(), randomNum10()];
		const dataB1 = [randomNum10(), randomNum10()];
		const dataC1 = [randomNum10(), randomNum10()];
		const dataD1 = [randomNum10(), randomNum10()];

		return [dataA, dataB, dataC, dataD, dataA1, dataB1, dataC1, dataD1];
	};

	const [chartData, setChartData] = useState(JSON.stringify(randomizeChart()));
	const [histogramData, setHistogramData] = useState(JSON.stringify(randomizeHistogram()));

	return (
		<div className="App">
			<header className={'App-header' + (fileLoaded ? ' file-loaded' : ' home')}>
				<>
					<img src="images/ov-logo.png" className="App-logo" />
				</>
				{(fileLoaded && (
					<a className="Back-button" href={'/'}>
						Back
					</a>
				)) || <></>}
			</header>
			{fileLoaded ? bamFileStats(bamFile) : bamConfigPanel(bamContext, updateContext)}

			<button className={'config-button' + (showBam ? ' active' : '')} onClick={() => toggleShowBam(!showBam)}>
				Show / Hide BAM
			</button>

			<div className={'bam-container' + (showBam ? ' bam-open' : '')}>
				{/* Needs to render on the page before scripts for BAM to work */}
				<div id="app"></div>
				{showBam ? (
					<>
						<h3>Bam.Iobio</h3>
						<button
							onClick={() => {
								// Work w/ Lifecycle Updates
								// setChartData(JSON.stringify(randomizeChart()));
								// setHistogramData(JSON.stringify(randomizeHistogram()));

								// Alt. state update solution
								window.location.reload();
							}}
						>
							Randomize
						</button>
						{bamContext.percentBox ? <iobio-percent-box data={chartData} /> : <></>}
						{bamContext.histogram ? <iobio-histogram data={histogramData} data-script-id="data" /> : <></>}
					</>
				) : null}
			</div>
		</div>
	);
}

export default App;
