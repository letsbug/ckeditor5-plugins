/**
 * @module clear-empty/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { clearEmpty, clearEmptyExecutable } from './utils';

export default class ClearEmptyCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const document = this.editor.model.document;
		const root = document.getRoot();

		// When the data is empty, there is a default <p> tag.
		if (root.childCount < 2) {
			this.isEnabled = false;
			return;
		}

		this.isEnabled = clearEmptyExecutable(document.selection.getSelectedBlocks());
	}

	/**
	 * @inheritDoc
	 */
	execute(/*options = {}*/) {
		const model = this.editor.model;
		const iterator = model.document.selection.getSelectedBlocks();
		iterator.next();
		if (iterator.done) {
			return;
		}

		model.change((writer) => {
			Array.from(iterator).forEach((block) => clearEmpty(writer, block));
		});
	}
}
