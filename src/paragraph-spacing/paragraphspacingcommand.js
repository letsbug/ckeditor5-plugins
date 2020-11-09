/**
 * @module indent-first/paragraphspacingcommand
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';

const ATTRIBUTE = 'paragraphSpacing';

export default class ParagraphSpacingCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const firstBlock = first(this.editor.model.document.selection.getSelectedBlocks());

		this.isEnabled = !!firstBlock && this._canSetAttribute(firstBlock);

		this.value = this.isEnabled && firstBlock.hasAttribute(ATTRIBUTE) ? firstBlock.getAttribute(ATTRIBUTE) : '1';
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		//
	}

	_canSetAttribute(block) {
		return this.editor.model.schema.checkAttribute(block, ATTRIBUTE);
	}
}
