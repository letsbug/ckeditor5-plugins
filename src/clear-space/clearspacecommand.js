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
		const doc = model.document;

		model.change((writer) => {
			clearSpace(writer, Array.from(doc.selection.getSelectedBlocks()));
		});
	}
}
