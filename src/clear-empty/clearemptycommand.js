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
		const doc = model.document;

		model.change((writer) => {
			clearEmpty(writer, Array.from(doc.selection.getSelectedBlocks()));
		});
	}
}
