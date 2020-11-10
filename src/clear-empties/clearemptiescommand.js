/**
 * @module clear-empties/clearemptiescommand
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';

export default class ClearEmptiesCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const firstBlock = first(this.editor.model.document.selection.getSelectedBlocks());
		this.isEnabled = !!firstBlock && this._canBeClear(firstBlock);
	}

	/**
	 * @inheritDoc
	 */
	execute() {}

	_canBeClear(block) {
		console.log(block);
		return !!block;
	}
}
