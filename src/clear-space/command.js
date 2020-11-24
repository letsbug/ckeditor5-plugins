/**
 * @module clear-space/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { clearSpace, clearSpaceExecutable } from './utils';

export default class ClearSpaceCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		this.isEnabled = clearSpaceExecutable(this.editor.model.document.selection.getSelectedBlocks());
	}

	/**
	 * @inheritDoc
	 */
	execute(/*options = {}*/) {
		const model = this.editor.model;
		const iterator = model.document.selection.getSelectedBlocks();

		model.change((writer) => {
			Array.from(iterator).forEach((block) => clearSpace(writer, block));
		});
	}
}
