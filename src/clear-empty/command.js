/**
 * @module clear-empty/command
 */
import { Command } from '@ckeditor/ckeditor5-core';

export class ClearEmptyCommand extends Command {
	/**
	 * @inheritDoc
	 */
	execute(/*options = {}*/) {
		const model = this.editor.model;
		let data = this.editor.getData();
		data = data.replace(/<p([^>])*>(\s|&nbsp;|<\/?br>)*<\/p>/g, '');
		const viewFragment = this.editor.data.processor.toView(data);
		const modelFragment = this.editor.data.toModel(viewFragment);
		model.insertContent(modelFragment, model.createRangeIn(model.document.getRoot()));
	}
}
