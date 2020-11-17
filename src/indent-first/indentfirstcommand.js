/**
 * @module indent-first/indentfirstcommand
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';
import { ATTRIBUTE } from './indentfirst';

/**
 * The indent-first command plugin.
 *
 * @extends module:core/command~Command
 */
export default class IndentFirstCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const firstBlock = first(this.editor.model.document.selection.getSelectedBlocks());
		this.isEnabled = !!firstBlock && this._canBeAligned(firstBlock);

		// 设置按钮状态
		if (this.isEnabled && firstBlock.hasAttribute(ATTRIBUTE)) {
			this.value = firstBlock.getAttribute(ATTRIBUTE);
		} else {
			this.value = null;
		}
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		// execute(options = {}) {
		const editor = this.editor;
		const model = editor.model;
		const doc = model.document;

		model.change((writer) => {
			const blocks = Array.from(doc.selection.getSelectedBlocks()).filter((block) => this._canBeAligned(block));
			const currentIndent = blocks[0].getAttribute(ATTRIBUTE);
			const removeIndent = currentIndent === ATTRIBUTE || !ATTRIBUTE;

			if (removeIndent) {
				removeFromSelection(blocks, writer);
			} else {
				setIndentOnSelection(blocks, writer, ATTRIBUTE);
			}
		});
	}

	_canBeAligned(block) {
		return this.editor.model.schema.checkAttribute(block, ATTRIBUTE);
	}
}

// Removes the indent-first attribute from blocks.
// @private
function removeFromSelection(blocks, writer) {
	for (const block of blocks) {
		writer.removeAttribute(ATTRIBUTE, block);
	}
}

// Sets the indent-first attribute on blocks.
// @private
function setIndentOnSelection(blocks, writer, plug) {
	for (const block of blocks) {
		writer.setAttribute(ATTRIBUTE, plug, block);
	}
}
