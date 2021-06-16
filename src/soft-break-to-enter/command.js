/**
 * @module soft-break-to-enter/command
 */
import { Command } from '@ckeditor/ckeditor5-core';

export default class SoftBreakToEnterCommand extends Command {
	/**
	 * @inheritDoc
	 */
	execute() {
		const model = this.editor.model;
		let data = this.editor.getData();
		data = data.replace(/<\/?(br)>/g, '</p><p>');
		const viewFragment = this.editor.data.processor.toView(data);
		const modelFragment = this.editor.data.toModel(viewFragment);
		model.insertContent(modelFragment, model.createRangeIn(model.document.getRoot()));
	}
}
