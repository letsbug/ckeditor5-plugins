/**
 * @module line-height/command
 */
import { Command } from '@ckeditor/ckeditor5-core';
import { ATTRIBUTE } from './index';
import { findFirst } from '../../utils';

export class LineHeightCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const firstBlock = findFirst(this.editor.model.document.selection.getSelectedBlocks(), allowedBlock);

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

function allowedBlock(block) {
	return !['image', 'table', 'media'].includes(block.name);
}

function removeLineHeightFromSelection(blocks, writer) {
	for (const block of blocks) {
		allowedBlock(block) && writer.removeAttribute(ATTRIBUTE, block);
	}
}

function setLineHeightOnSelection(blocks, writer, lineHeight) {
	for (const block of blocks) {
		allowedBlock(block) && writer.setAttribute(ATTRIBUTE, lineHeight, block);
	}
}
