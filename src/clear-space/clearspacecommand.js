/**
 * @module clear-space/clearspacecommand
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { clearSpace, clearSpaceExecutable } from './utils';

export default class ClearSpaceCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const blocks = this.editor.model.document.selection.getSelectedBlocks();
		this.isEnabled = !!blocks && clearSpaceExecutable(Array.from(blocks));
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
		if (!blocks.length) {
			return;
		}

		model.change((writer) => {
			blocks.forEach((block) => clearSpace(writer, block));
		});
	}
}
