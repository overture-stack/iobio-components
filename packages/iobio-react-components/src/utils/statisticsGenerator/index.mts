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

import readline from 'node:readline/promises';
import { generateIobioStats } from './statisticsTools.mts';

/** Launch command line prompt for user input, then generate stats */
const readlineInterface = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

console.log('***** Overture Components: Iobio Metadata Generator *****');

const fileUrl = await readlineInterface.question('\nBam File URL: ');
if (!fileUrl) throw new Error('Alignment URL is required to generate statistics \nusage: pnpm run stats ${url}');

const indexFileUrl = await readlineInterface.question('\nIndex File URL (optional): ');
const outputOption = await readlineInterface.question('\nOutput as JSON? (Y/N): ');
const enableFileOutput = outputOption.toLowerCase() === 'y';
readlineInterface.close();

const serverUrl = process.env.IOBIO_SERVER_URL;
generateIobioStats({ fileUrl, indexFileUrl, enableFileOutput, serverUrl });
