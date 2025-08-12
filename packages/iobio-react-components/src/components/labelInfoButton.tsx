/*
 *
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
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

import { type ReactNode } from 'react';
import { type IobioInfoModalKeys, bamDisplayNames, infoModalCopy } from '../utils/constants';

/**
 * Visualizer Label w/ Modal Info Button
 * @param bamKey Optional BamKey for using default label and modal copy values. Overrides label & children.
 * @param children Optional React Children node for custom modal content
 * @param label Optional custom String Label to display next to Info Button
 */
const IobioLabelInfoButton = ({
	bamKey,
	children,
	label,
}: {
	bamKey?: IobioInfoModalKeys;
	children?: ReactNode;
	label?: string;
}) => {
	const labelText = bamKey !== undefined ? bamDisplayNames[bamKey] : label;
	const modalContent = bamKey !== undefined ? <p>{infoModalCopy[bamKey]}</p> : children;

	return (
		<iobio-label-info-button label={labelText}>
			<div slot="content">{modalContent}</div>
		</iobio-label-info-button>
	);
};

export default IobioLabelInfoButton;
