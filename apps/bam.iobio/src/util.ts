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

export const iobioURL = 'https://s3.amazonaws.com/iobio/NA12878/NA12878.autsome.bam';

export const BamDisplayNames = {
	mappedReads: 'Mapped Reads',
	forwardStrands: 'Forward Strands',
	properPairs: 'Proper Pairs',
	singletons: 'Singletons',
	bothMatesMapped: 'Both Mates Mapped',
	duplicates: 'Duplicates',
	coverageDepth: 'Coverage Depth',
	coverage_hist: 'Read Coverage Distribution',
	frag_hist: 'Fragment Length',
	length_hist: 'Read Length',
	mapq_hist: 'Mapping Quality',
	baseq_hist: 'Base Quality',
};

export const defaultBamContext = {
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

export type BamContext = typeof defaultBamContext;

export type BamKey = keyof typeof defaultBamContext;

export const BamDataKeys = Object.keys(defaultBamContext) as Array<BamKey>;

export const percentKeys = BamDataKeys.slice(0, 6);

export const histogramKeys = BamDataKeys.slice(7);

export const ignoreOutlierKeys = [BamDataKeys[8], BamDataKeys[9]];
