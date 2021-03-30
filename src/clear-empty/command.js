/**
 * @module clear-empty/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class ClearEmptyCommand extends Command {
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

		// const range = model.createRangeIn(model.document.getRoot());
		//
		// for (const walker of range.getWalker()) {
		// 	console.log(walker);
		// }
		// const iterator = model.document.getRoot().getChildren();

		// const batch = model.createBatch('transparent');
		// for (const element of iterator) {
		// 	if (this._inExcludes(element)) {
		// 		continue;
		// 	}
		// 	if (element.isEmpty || this._isEmpty(element)) {
		// 		// TODO 'transparent' cannot execute 'undo' command
		// 		// TODO 'Default' is treated as multiple batches, and the number of batches is the length of 'iterator', It's no different than using 'change' directly
		// 		// TODO 'Invalid value used as weak map key' error in custom batch execution of 'undo' command
		// 		model.enqueueChange('transparent', (writer) => {
		// 			writer.remove(element);
		// 		});
		// 	}
		// }
	}

	// /**
	//  * is it a picture, video or table
	//  *
	//  * @param block
	//  * @returns {boolean}
	//  */
	// _inExcludes(block) {
	// 	return ['image', 'media', 'table'].some((e) => block.is('element', e));
	// }
	//
	// /**
	//  * block's content is empty
	//  *
	//  * @param block
	//  * @returns {boolean}
	//  */
	// _isEmpty(block) {
	// 	const text = Array.from(block.getChildren())
	// 		.map((c) => c.data)
	// 		.join('');
	// 	return /^\s*$/.test(text);
	// }
}
