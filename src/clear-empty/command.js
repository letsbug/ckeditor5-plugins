/**
 * @module clear-empty/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { findFirst } from '../utils';

export default class ClearEmptyCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const document = this.editor.model.document;
		const root = document.getRoot();

		// When the data is empty, there is a default <p> tag.
		if (root.childCount < 2) {
			this.isEnabled = false;
			return;
		}

		this.isEnabled = this._executable(document.selection.getSelectedBlocks());
	}

	/**
	 * @inheritDoc
	 */
	execute(/*options = {}*/) {
		const model = this.editor.model;
		const iterator = model.document.selection.getSelectedBlocks();

		model.change((writer) => {
			for (const block of iterator) {
				if (this._inExcludes(block)) {
					continue;
				}
				if (block.isEmpty || this._isEmpty(block)) {
					const range = writer.createRangeOn(block);
					writer.remove(range);
				}
			}
		});
	}

	/**
	 * is it a picture, video or table
	 *
	 * @param block
	 * @returns {boolean}
	 */
	_inExcludes(block) {
		return ['image', 'media', 'table'].some((e) => block.is('element', e));
	}

	/**
	 * block's content is empty
	 *
	 * @param block
	 * @returns {boolean}
	 */
	_isEmpty(block) {
		const text = Array.from(block.getChildren())
			.map((c) => c.data)
			.join('');
		return /^\s*$/.test(text);
	}

	/**
	 * Identify whether the clearEmpty button can be executed
	 *
	 * @param iterators
	 * @return {boolean}
	 */
	_executable(iterators) {
		const first = findFirst(iterators, (item) => item.isEmpty || (!this._inExcludes(item) && this._isEmpty(item)));
		return !!first;
	}
}
