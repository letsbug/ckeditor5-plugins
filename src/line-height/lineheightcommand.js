import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';
// import { isDefault } from './utils'

const LINE_HEIGHT_ATTRIBUTE = 'lineHeight';

export default class LineHeightCommand extends Command {
	refresh() {
		const firstBlock = first(this.editor.model.document.selection.getSelectedBlocks());

		this.isEnabled = !!firstBlock && this._canSetLineHeight(firstBlock);

		this.value = this.isEnabled && firstBlock.hasAttribute(LINE_HEIGHT_ATTRIBUTE) ? firstBlock.getAttribute(LINE_HEIGHT_ATTRIBUTE) : '1.75';
	}

	execute(options = {}) {
		const editor = this.editor;
		const model = editor.model;
		const doc = model.document;
		const value = options.value;

		model.change((writer) => {
			const blocks = Array.from(doc.selection.getSelectedBlocks()).filter((block) => this._canSetLineHeight(block));
			const currentLineHeight = blocks[0].getAttribute(LINE_HEIGHT_ATTRIBUTE);
			const removeLineHeight = /* isDefault( value ) ||  */ currentLineHeight === value || typeof value === 'undefined';

			if (removeLineHeight) {
				removeLineHeightFromSelection(blocks, writer);
			} else {
				setLineHeightOnSelection(blocks, writer, value);
			}
		});
	}

	_canSetLineHeight(block) {
		return this.editor.model.schema.checkAttribute(block, LINE_HEIGHT_ATTRIBUTE);
	}
}

function removeLineHeightFromSelection(blocks, writer) {
	for (const block of blocks) {
		writer.removeAttribute(LINE_HEIGHT_ATTRIBUTE, block);
	}
}

function setLineHeightOnSelection(blocks, writer, lineHeight) {
	for (const block of blocks) {
		writer.setAttribute(LINE_HEIGHT_ATTRIBUTE, lineHeight, block);
	}
}
