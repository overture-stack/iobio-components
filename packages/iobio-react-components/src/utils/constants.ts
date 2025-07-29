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

// Iobio
export const BamKeys = [
	'mapped_reads',
	'mean_read_coverage',
	'forward_strands',
	'proper_pairs',
	'singletons',
	'both_mates_mapped',
	'duplicates',
	'coverage_depth',
	'coverage_hist',
	'frag_hist',
	'length_hist',
	'mapq_hist',
	'baseq_hist',
	'mapped_reads_percentage',
	'forward_strands_percentage',
	'proper_pairs_percentage',
	'singletons_percentage',
	'both_mates_mapped_percentage',
	'duplicates_percentage',
] as const;
export type BamKey = (typeof BamKeys)[number];
export type BamContext = Partial<Record<BamKey, boolean>>;

export const defaultBamContext = {
	mapped_reads: true,
	forward_strands: true,
	proper_pairs: true,
	singletons: true,
	both_mates_mapped: true,
	duplicates: true,
	coverage_depth: true,
	coverage_hist: true,
	frag_hist: true,
	length_hist: true,
	mapq_hist: true,
	baseq_hist: true,
} as const satisfies BamContext;

export const BamDisplayNames = {
	mapped_reads: 'Mapped Reads',
	mean_read_coverage: 'Mean Read Coverage',
	forward_strands: 'Forward Strands',
	proper_pairs: 'Proper Pairs',
	singletons: 'Singletons',
	both_mates_mapped: 'Both Mates Mapped',
	duplicates: 'Duplicates',
	coverage_depth: 'Coverage Depth',
	coverage_hist: 'Read Coverage Distribution',
	frag_hist: 'Fragment Length',
	length_hist: 'Read Length',
	mapq_hist: 'Mapping Quality',
	baseq_hist: 'Base Quality',
	mapped_reads_percentage: 'Mapped Reads Percentage',
	forward_strands_percentage: 'Forward Strands Percentage',
	proper_pairs_percentage: 'Proper Pairs Percentage',
	singletons_percentage: 'Singletons Percentage',
	both_mates_mapped_percentage: 'Both Mates Mapped Percentage',
	duplicates_percentage: 'Duplicates Percentage',
} as const satisfies Record<BamKey, string>;

export const histogramKeys = [
	'coverage_hist',
	'frag_hist',
	'length_hist',
	'mapq_hist',
	'baseq_hist',
] as const satisfies Array<BamKey>;

export const metadataPercentageKeys = [
	'mapped_reads_percentage',
	'forward_strands_percentage',
	'proper_pairs_percentage',
	'singletons_percentage',
	'both_mates_mapped_percentage',
	'duplicates_percentage',
] as const satisfies Array<BamKey>;

export const percentKeys = [
	'mapped_reads',
	'forward_strands',
	'proper_pairs',
	'singletons',
	'both_mates_mapped',
	'duplicates',
] as const satisfies Array<BamKey>;
export type PercentageStatsKey = `${(typeof percentKeys)[number]}_percentage`;

export const statisticKeys = [
	'failed_qc',
	'first_mates',
	'last_read_position',
	'mean_read_coverage',
	'paired_end_reads',
	'reverse_strands',
	'second_mates',
	'total_reads',
] as const;

export type BamHistogramKey = (typeof histogramKeys)[number];
export type BamPercentKey = (typeof percentKeys)[number];
export type StatisticKey = (typeof statisticKeys)[number];
export type BamOutlierKey = (typeof ignoreOutlierKeys)[number];

export const ignoreOutlierKeys = ['frag_hist', 'length_hist'] as const satisfies Array<BamKey>;

// Files
export const bamFileExtension = 'BAM';
export const cramFileExtension = 'CRAM';
export const BamFileExtensions = [bamFileExtension, cramFileExtension];
