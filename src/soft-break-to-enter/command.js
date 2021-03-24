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
		this.isEnabled = softBreakToEnterExecutable(this.editor.model.document.selection.getSelectedBlocks());
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		const model = this.editor.model;

		model.change((writer) => {
			for (const v of model.document.selection.getSelectedBlocks()) {
				softBreakToEnter(writer, v);
			}
		});
	}
}
