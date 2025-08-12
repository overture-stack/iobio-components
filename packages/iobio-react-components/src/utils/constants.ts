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

import { type DataUpdate } from './iobioTypes.ts';

/* ========================== *
 *  Iobio Component Constants  *
 * ========================== */
export const bamKeys = [
	'mapped_reads',
	'mean_read_coverage',
	'forward_strands',
	'proper_pairs',
	'singletons',
	'both_mates_mapped',
	'duplicates',
	'failed_qc',
	'first_mates',
	'last_read_position',
	'paired_end_reads',
	'reverse_strands',
	'second_mates',
	'total_reads',
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
export type BamKey = (typeof bamKeys)[number];
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

export const bamDisplayNames = {
	mapped_reads: 'Mapped Reads',
	mean_read_coverage: 'Mean Read Coverage',
	forward_strands: 'Forward Strands',
	proper_pairs: 'Proper Pairs',
	singletons: 'Singletons',
	both_mates_mapped: 'Both Mates Mapped',
	duplicates: 'Duplicates',
	failed_qc: 'Failed QC',
	first_mates: 'First Mates',
	last_read_position: 'Last Read Position',
	paired_end_reads: 'Paired End Reads',
	reverse_strands: 'Reverse Strands',
	second_mates: 'Second Mates',
	total_reads: 'Total Reads',
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

export const isBamKey = (key: string): key is BamKey => {
	return bamKeys.includes(key as BamKey);
};

export const isOutlierKey = (key: BamKey): key is BamOutlierKey => {
	return ignoreOutlierKeys.includes(key as BamOutlierKey);
};

export const isPercentKey = (key: keyof DataUpdate): key is BamPercentKey =>
	percentKeys.some((percentKey) => percentKey === key);

/* ========================= *
 *  BAM/CRAM File Constants  *
 * ========================= */
export const bamFileExtension = 'BAM';
export const cramFileExtension = 'CRAM';
export const bamFileExtensions = [bamFileExtension, cramFileExtension];

/* ============================================= *
 * Default Info Button Pop Up Modal Descriptions *
 * ============================================= */

export type IobioInfoModalKeys = BamHistogramKey | BamPercentKey;

export const infoModalCopy: Record<IobioInfoModalKeys, string> = {
	mapped_reads:
		'The mapped reads chart shows how many of the reads in the sample were successfully mapped to the reference genome. Genetic variation, in particular structural variants, ensure that every sequenced sample is genetically different to the reference genome it was aligned to. If the sample differs only in a small number of single base pair changes (e.g. SNVs), the read will still likely map to the reference, but, for more significant variation, the read can fail to be placed. Therefore, it is not expected that the mapped reads rate will hit 100%, but it is expected to be high (usually >90%).',
	forward_strands:
		'The forward strand chart shows the fraction of reads that map to the forward DNA strand. The general expectation is that the DNA library preparation step will generate DNA from the forward and reverse strands in equal amounts. After mapping the reads to the reference genome, approximately 50% of the reads will consequently map to the forward strand. If the observed rate is significantly different to 50%, this may be indicative of problems with the library preparation step.',
	proper_pairs:
		'A fragment consisting of two mates is called a proper pair if both mates map to the reference genome in a manner consistent with expectations. In particular, if the DNA library consists of fragments ~500 base pairs in length, and 100 base pair reads are sequenced from either end, the expectation would be that the two reads map to the reference genome separated by ~300 base pairs. If the sequenced sample contains large structural variants, e.g. a large insertion, reads mapping with a large separation would be a signal for this variant, and the reads would not be proper pairs. Based on the sequencing technology, there is also an expectation on the orientation of each read in the fragment. When calculating the proper pair rate, pairs where both mates are unmapped are not included in the analysis. As a consequence, the rate of proper pairs is expected to be well over 90%; even if the mapping rate itself is low as a result of bacterial contamination, for example.',
	singletons:
		'When working with paired-end sequencing, each DNA fragment is sequenced from both ends, creating two mates for each pair. If one mate in the pair successfully maps to the reference genome, but the other is unmapped, the mapped mate is a singleton. One way in which a singleton could occur would be if the sample has a large insertion compared with the reference genome; one mate can fall in sequence flanking the insertion and will be mapped, but the other falls in the inserted sequence and so cannot map to the reference genome. There are unlikely to many such structural variants in the sample, or sequencing errors that would could cause a read to not be able to map. Consequently, the singleton rate is expected to be very low (<1%).',
	both_mates_mapped:
		'When working with paired-end sequencing, each DNA fragment is sequenced from both ends, creating two mates for each pair. This chart shows the fraction of reads in pairs where both of the mates successfully map to the reference genome. When calculating this metric, pairs where both mates are unmapped are not included.',
	duplicates:
		'PCR duplicates are two (or more) reads that originate from the same DNA fragment. When sequencing data is analysed, it is assumed that each observation (i.e. each read) is independent; an assumption that fails in the presence of duplicate reads. Typically, algorithms look for reads that map to the same genomic coordinate, and whose mates also map to identical genomic coordinates. It is important to note that as the sequencing depth increases, more reads are sampled from the DNA library, and consequently it is increasingly likely that duplicate reads will be sampled. As a result, the true duplicate rate is not independent of the depth, and they should both be considered when looking at the duplicate rate. Additionally, as the sequencing depth in increases, it is also increasingly likely that reads will map to the same location and be marked as duplicates, even when they are not. As such, as the sequencing depth approaches and surpasses the read length, the duplicate rate starts to become less indicative of problems.',
	coverage_hist:
		'The read coverage shows how the read coverage varies across the entire genome. The coloured numbers above represent chromosomes in the reference genome used and can be selected to view the read coverage in an individual chromosome. Selecting a different chromosome will cause all other metrics in bam.iobio to be recalculated based on reads sampled from that chromosome only. You can also focus on a smaller region by dragging over the region of interest. The mean coverage across the entire genome or sigle chromosome is shown as a red line.',
	frag_hist:
		'For paired end sequencing, DNA fragments are typically size selected to a uniform length and then sequenced from either end. Once the two mates are aligned back to the reference genome, the fragment length can be inferred from how far apart these two mates map. If the sequenced sample has a deletion or insertion relative to the reference, this will result in the two mates mapping closer together, or further apart than expected. Under the assumption that the sequenced sample has a relatively small number of insertions and deletions, we expect to see the fragment length follow a normal distribution.',
	length_hist:
		'The read length is usually a very simple distribution. In most cases, the read length is fixed at a uniform length, e.g. 100 base pairs, or 150 base pairs etc. The read length distribution, therefore, tends to be a single spike at this read length. Depending on the sequencing technology used, this may not always be the case.',
	mapq_hist:
		'The mapping quality distribution shows the Phred quality scores describing the probability that a read does not map to the location that it has been assigned to (specifically, Q=-log10(P), where Q is the Phred score and P is the probability the read is in the wrong location). So the larger the score, the higher the quality of the mapping. Some scores have specific meaning, e.g. a score of 0 means that the read could map equally to multiple places in the reference genome. The majority of reads should be well mapped and so we expect to see this distribution heavily skewed to large value (typically around 60). It is not unusual to see some scores around zero. Reads originating from repetitive elements in the genome will plausibly map to multiple locations.',
	baseq_hist:
		'Similar to the mapping quality distribution, the base quality distribution shows the Phred quality scores describing the probability that a nucleotide has been incorrectly assigned; e.g. an error in the sequencing. Specifically, Q=-log10(P), where Q is the Phred score and P is the probability the nucleotide is wrong. The larger the score, the more confident we are in the base call. Depending on the sequencing technology, we can expect to see different distributions, but we expect to see a distribution skewed towards larger (more confident) scores; typically around 40.',
};
