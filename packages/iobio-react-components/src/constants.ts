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

export const BamKeys = [
	'mapped_reads',
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
] as const;

export type BamKey = (typeof BamKeys)[number];

export type BamContext = Record<BamKey, boolean>;

export const BamDisplayNames = {
	mapped_reads: 'Mapped Reads',
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
} as const satisfies Record<BamKey, string>;
