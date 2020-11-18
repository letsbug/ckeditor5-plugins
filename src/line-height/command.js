/**
 * @module line-height/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';
import { ATTRIBUTE } from './index';

export default class LineHeightCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const firstBlock = first(this.editor.model.document.selection.getSelectedBlocks());

		this.isEnabled = !!firstBlock && this._canSetLineHeight(firstBlock);
		this.value = this.isEnabled && firstBlock.hasAttribute(ATTRIBUTE) ? firstBlock.getAttribute(ATTRIBUTE) : 'Default';
	}

	/**
	 * @inheritDoc
	 */
	execute(options = {}) {
		const model = this.editor.model;
		const doc = model.document;
		const value = options.value;

		model.change((writer) => {
			const blocks = Array.from(doc.selection.getSelectedBlocks()).filter((block) => this._canSetLineHeight(block));
			const currentLineHeight = blocks[0].getAttribute(ATTRIBUTE);
			const removeLineHeight = currentLineHeight === value || typeof value === 'undefined';

			if (removeLineHeight) {
				removeLineHeightFromSelection(blocks, writer);
			} else {
				setLineHeightOnSelection(blocks, writer, value);
			}
		});
	}

	_canSetLineHeight(block) {
		return this.editor.model.schema.checkAttribute(block, ATTRIBUTE);
	}
}

function removeLineHeightFromSelection(blocks, writer) {
	for (const block of blocks) {
		writer.removeAttribute(ATTRIBUTE, block);
	}
}

function setLineHeightOnSelection(blocks, writer, lineHeight) {
	for (const block of blocks) {
		writer.setAttribute(ATTRIBUTE, lineHeight, block);
	}
}
