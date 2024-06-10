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
	pieChooser: true,
	readCoverageBox: true,
	readsSampledBox: true,
	mappedReads: true,
	forwardStrands: true,
	properPairs: true,
	singletons: true,
	bothMatesMapped: true,
	duplicates: true,
	mappingQualityDistribution: true,
};

type BamContext = typeof defaultBamContext;

const bamConfigPanel = (bamContext: BamContext, updateContext: (key: keyof BamContext, value: boolean) => void) => {
	const {
		pieChooser,
		readCoverageBox,
		readsSampledBox,
		mappedReads,
		forwardStrands,
		properPairs,
		singletons,
		bothMatesMapped,
		duplicates,
		mappingQualityDistribution,
	} = bamContext;

	return (
		<div style={{ margin: '15px' }}>
			<button
				className={'config-button' + (pieChooser ? ' active' : '')}
				onClick={() => {
					updateContext('pieChooser', pieChooser);
				}}
			>
				Pie Chooser
			</button>
			<button
				className={'config-button' + (readCoverageBox ? ' active' : '')}
				onClick={() => {
					updateContext('readCoverageBox', readCoverageBox);
				}}
			>
				Read Coverage
			</button>
			<button
				className={'config-button' + (readsSampledBox ? ' active' : '')}
				onClick={() => {
					updateContext('readsSampledBox', readsSampledBox);
				}}
			>
				Reads Sampled
			</button>
			<button
				className={'config-button' + (mappedReads ? ' active' : '')}
				onClick={() => {
					updateContext('mappedReads', mappedReads);
				}}
			>
				Mapped Reads
			</button>
			<button
				className={'config-button' + (forwardStrands ? ' active' : '')}
				onClick={() => {
					updateContext('forwardStrands', forwardStrands);
				}}
			>
				Forward Strands
			</button>
			<button
				className={'config-button' + (properPairs ? ' active' : '')}
				onClick={() => {
					updateContext('properPairs', properPairs);
				}}
			>
				Proper Pairs
			</button>
			<button
				className={'config-button' + (singletons ? ' active' : '')}
				onClick={() => {
					updateContext('singletons', singletons);
				}}
			>
				Singletons
			</button>
			<button
				className={'config-button' + (bothMatesMapped ? ' active' : '')}
				onClick={() => {
					updateContext('bothMatesMapped', bothMatesMapped);
				}}
			>
				Both Mates Mapped
			</button>
			<button
				className={'config-button' + (duplicates ? ' active' : '')}
				onClick={() => {
					updateContext('duplicates', duplicates);
				}}
			>
				Duplicates
			</button>
			<button
				className={'config-button' + (mappingQualityDistribution ? ' active' : '')}
				onClick={() => {
					updateContext('mappingQualityDistribution', mappingQualityDistribution);
				}}
			>
				Mapping Quality Distribution
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
	const bamUrl = '/?bam=https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam';

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

	const randomizeChart = () => {
		const randomNumA = Math.round(Math.random() * 10);
		const randomNumB = Math.round(Math.random() * 10);

		return [randomNumA, randomNumB];
	};

	const randomizeHistogram = () => {
		const dataA = [Math.round(Math.random() * 10), Math.round(Math.random() * 10)];
		const dataB = [Math.round(Math.random() * 10), Math.round(Math.random() * 10)];
		const dataC = [Math.round(Math.random() * 10), Math.round(Math.random() * 10)];
		const dataD = [Math.round(Math.random() * 10), Math.round(Math.random() * 10)];

		return [dataA, dataB, dataC, dataD];
	};

	const [chartData, setChartData] = useState(JSON.stringify(randomizeChart()));
	const [histogramData, setHistogramData] = useState(JSON.stringify(randomizeHistogram()));

	return (
		<div className="App">
			<header className={'App-header' + (fileLoaded ? ' file-loaded' : ' home')}>
				<>
					<img src="images/ov-logo.png" className="App-logo" />
					<p>
						Edit <code>src/App.js</code> and save to reload.
					</p>
				</>
				{fileLoaded ? (
					<a className="Back-button" href={'/'}>
						Back
					</a>
				) : (
					<a href={bamUrl}>Demo URL</a>
				)}
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
								window.location.reload();
							}}
						>
							Randomize
						</button>
						<iobio-percent-box data={chartData} />
						<iobio-histogram
							data={histogramData}
							data-script-id="data"
							data-url="https://cdn.jsdelivr.net/npm/iobio-charts@0.3/test/example_data.json"
						/>
					</>
				) : null}
			</div>
		</div>
	);
}

export default App;
