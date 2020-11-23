/**
 * @module indent-first/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { ATTRIBUTE } from './index';
import { excludes, indentFirst, indentFirstExecutable } from './utils';
import { findFirst } from '../utils';

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
		const first = findFirst(
			this.editor.model.document.selection.getSelectedBlocks(),
			(item) => !excludes.includes(item.name)
		);
		this.isEnabled = !!first && indentFirstExecutable(this.editor.model.schema, first);

		// 设置按钮状态
		if (this.isEnabled && first.hasAttribute(ATTRIBUTE)) {
			this.value = first.getAttribute(ATTRIBUTE);
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
