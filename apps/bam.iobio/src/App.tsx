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
import { IobioCoverageDepth, IobioDataBroker, IobioHistogram, IobioPercentBox } from 'components';
import { useEffect, useState } from 'react';
import './App.css';

const iobioURL = 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam';

const defaultBamContext = {
	mappedReads: true,
	forwardStrands: true,
	properPairs: true,
	singletons: true,
	bothMatesMapped: true,
	duplicates: true,
	coverageDepth: true,
	coverage_hist: true,
	frag_hist: true,
	length_hist: true,
	mapq_hist: true,
	baseq_hist: true,
};

type BamContext = typeof defaultBamContext;

const bamConfigPanel = (bamContext: BamContext, updateContext: (key: keyof BamContext, value: boolean) => void) => {
	const keys = Object.keys(bamContext) as (keyof BamContext)[];

	return (
		<div style={{ margin: '15px' }}>
			{keys.map((key) => {
				return (
					<button
						className={clsx('config-button', bamContext[key] && 'active')}
						key={key}
						onClick={() => {
							updateContext(key, bamContext[key]);
						}}
					>
						{key}
					</button>
				);
			})}
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

	const {
		coverageDepth,
		mappedReads,
		forwardStrands,
		properPairs,
		singletons,
		bothMatesMapped,
		duplicates,
		coverage_hist,
		frag_hist,
		length_hist,
		mapq_hist,
		baseq_hist,
	} = bamContext;

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

						<IobioDataBroker url={iobioURL} />

						{/* Percent Boxes */}
						<div className="row iobio-container">
							{mappedReads && <IobioPercentBox title="Mapped Reads" percentKey="mapped_reads" totalKey="total_reads" />}
							{forwardStrands && (
								<IobioPercentBox title="Forward Strands" percentKey="forward_strands" totalKey="total_reads" />
							)}
							{properPairs && <IobioPercentBox title="Proper Pairs" percentKey="proper_pairs" totalKey="total_reads" />}
							{singletons && <IobioPercentBox title="Singletons" percentKey="singletons" totalKey="total_reads" />}
							{bothMatesMapped && (
								<IobioPercentBox title="Both Mates Mapped" percentKey="both_mates_mapped" totalKey="total_reads" />
							)}
							{duplicates && <IobioPercentBox title="Duplicates" percentKey="duplicates" totalKey="total_reads" />}
						</div>

						{/* Coverage Depth */}
						{coverageDepth && (
							<div className="row iobio-chart-container">
								<IobioCoverageDepth />
							</div>
						)}

						{/* Histograms */}
						{coverage_hist && (
							<div className="row iobio-chart-container">
								<IobioHistogram brokerKey="coverage_hist" title="Read Coverage Distribution" color="red" />
							</div>
						)}
						{frag_hist && (
							<div className="row iobio-chart-container">
								<IobioHistogram brokerKey="frag_hist" title="Fragment Length" color="orange" ignoreOutliers />
							</div>
						)}
						{length_hist && (
							<div className="row iobio-chart-container">
								<IobioHistogram brokerKey="length_hist" title="Read Length" color="gold" ignoreOutliers />
							</div>
						)}
						{mapq_hist && (
							<div className="row iobio-chart-container">
								<IobioHistogram brokerKey="mapq_hist" title="Mapping Quality" color="aquamarine" />
							</div>
						)}
						{baseq_hist && (
							<div className="row iobio-chart-container">
								<IobioHistogram brokerKey="baseq_hist" title="Base Quality" color="cornflowerblue" />
							</div>
						)}
					</>
				) : null}
			</div>
		</div>
	);
}

export default App;
