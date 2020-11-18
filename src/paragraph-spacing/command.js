/**
 * @module paragraph-spacing/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';
import { ATTRIBUTE } from './index';

export default class ParagraphSpacingCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const firstBlock = first(this.editor.model.document.selection.getSelectedBlocks());

		this.isEnabled = !!firstBlock && this._canSetAttribute(firstBlock);
		this.value = this.isEnabled && firstBlock.hasAttribute(ATTRIBUTE) ? firstBlock.getAttribute(ATTRIBUTE) : 'Default';
	}

	/**
	 * @inheritDoc
	 */
	execute(options = {}) {
		const editor = this.editor;
		const model = editor.model;
		const doc = model.document;
		const value = options.value;

		model.change((writer) => {
			const blocks = Array.from(doc.selection.getSelectedBlocks()).filter((block) => this._canSetAttribute(block));
			const currentSpacing = blocks[0].getAttribute(ATTRIBUTE);
			const removeSpacing = currentSpacing === value || typeof value === 'undefined';

			if (removeSpacing) {
				removeParagraphSpacingFromSelection(blocks, writer);
			} else {
				setParagraphSpacingOnSelection(blocks, writer, value);
			}
		});
	}

	_canSetAttribute(block) {
		return this.editor.model.schema.checkAttribute(block, ATTRIBUTE);
	}
}

function removeParagraphSpacingFromSelection(blocks, writer) {
	for (const block of blocks) {
		writer.removeAttribute(ATTRIBUTE, block);
	}
}

function setParagraphSpacingOnSelection(blocks, writer, value) {
	for (const block of blocks) {
		writer.setAttribute(ATTRIBUTE, value, block);
	}
}
