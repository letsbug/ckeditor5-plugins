/**
 * @module indent-first/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import first from '@ckeditor/ckeditor5-utils/src/first';
import { ATTRIBUTE } from './index';
import { indentFirst, indentFirstExecutable } from './utils';

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
		this.isEnabled = !!firstBlock && indentFirstExecutable(this.editor.model.schema, firstBlock);

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
		const model = this.editor.model;
		const schema = model.schema;
		const selection = model.document.selection.getSelectedBlocks();

		model.change((writer) => {
			const blocks = Array.from(selection).filter((block) => indentFirstExecutable(schema, block));
			indentFirst(writer, blocks);
		});
	}
}
