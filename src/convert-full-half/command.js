/**
 * @module convert-full-half/command
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { convertFullHalf, convertFullHalfExecutable, findCommandExecuteType } from './utils';

export default class ConvertFullHalfCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const iterator = this.editor.model.document.selection.getSelectedBlocks();

		if (!iterator) {
			this.isEnabled = false;
			return;
		}

		this.isEnabled = convertFullHalfExecutable(iterator);
		if (!this.isEnabled) {
			return;
		}

		const blocks = Array.from(iterator);
		this.value = findCommandExecuteType(blocks);
	}

	/**
	 * Executes the command. convert half to full or full to half.
	 *
	 * @param options
	 * @fires execute
	 */
	execute(options = {}) {
		const model = this.editor.model;
		const iterator = model.document.selection.getSelectedBlocks();

		if (!iterator) {
			return;
		}

		const blocks = Array.from(iterator);
		if (!blocks.length) {
			return;
		}

		const type = options.type || this.value;
		model.change((writer) => {
			blocks.forEach((block) => convertFullHalf(writer, block, type));
		});
	}
}
