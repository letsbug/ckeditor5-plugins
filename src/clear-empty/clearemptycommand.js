/**
 * @module clear-empty/clearemptycommand
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { clearEmpty, clearEmptyExecutable } from './utils';

export default class ClearEmptyCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const blocks = this.editor.model.document.selection.getSelectedBlocks();
		this.isEnabled = !!blocks && clearEmptyExecutable(Array.from(blocks));
	}

	/**
	 * @inheritDoc
	 */
	execute(/*options = {}*/) {
		const model = this.editor.model;
		const iterator = model.document.selection.getSelectedBlocks();
		if (!iterator) {
			return;
		}

		const blocks = Array.from(iterator);
		if (blocks.length < 2) {
			return;
		}

		model.change((writer) => {
			blocks.forEach((block) => clearEmpty(writer, block));
		});
	}
}
