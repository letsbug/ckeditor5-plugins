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
		this.isEnabled = clearEmptyExecutable(this.editor.model.document);
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

		model.change((writer) => {
			Array.from(iterator).forEach((block) => clearEmpty(writer, block));
		});
	}
}
