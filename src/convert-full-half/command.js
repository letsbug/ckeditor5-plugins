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

		this.isEnabled = convertFullHalfExecutable(this.editor.model.document.selection.getSelectedBlocks());
		if (!this.isEnabled) {
			return;
		}

		this.value = findCommandExecuteType(iterator);
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
		const type = options.type || this.value;

		model.change((writer) => {
			Array.from(iterator).forEach((block) => convertFullHalf(writer, block, type));
		});
	}
}
