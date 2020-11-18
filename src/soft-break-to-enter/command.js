/**
 * @module soft-break-to-enter/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { softBreakToEnter, softBreakToEnterExecutable } from './utils';

export default class SoftBreakToEnterCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const blocks = this.editor.model.document.selection.getSelectedBlocks();
		this.isEnabled = !!blocks && softBreakToEnterExecutable(Array.from(blocks));
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		const model = this.editor.model;
		const doc = model.document;

		model.change((writer) => {
			const blocks = Array.from(doc.selection.getSelectedBlocks());
			if (!blocks) {
				return;
			}

			blocks.forEach((block) => softBreakToEnter(writer, block));
		});
	}
}
