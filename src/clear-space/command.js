/**
 * @module clear-space/command
 */
import { Command } from '@ckeditor/ckeditor5-core';
import { findFirst, EXCLIDEBLOCK } from '../utils';

// All white space characters except '\n'
const empties = ' \\f\\r\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff';

export class ClearSpaceCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		this.isEnabled = this._executable(this.editor.model.document.selection.getSelectedBlocks());
	}

	/**
	 * @inheritDoc
	 */
	execute(/*options = {}*/) {
		const model = this.editor.model;
		const iterator = model.document.selection.getSelectedBlocks();

		model.change((writer) => {
			for (const block of iterator) {
				if (this._exclude(block)) {
					continue;
				}

				const childes = Array.from(block.getChildren());
				if (!childes.length) {
					continue;
				}
				const replace = [];

				childes.forEach((node, i) => {
					const attrs = Object.fromEntries(node.getAttributes());
					if (node.is('$text')) {
						let text = node.data.replace(new RegExp(`[${empties}]+`, 'g'), ' ');

						if (i === 0 || (i > 0 && new RegExp(`[${empties}]+$`).test(childes[i - 1].data))) {
							text = text.replace(new RegExp(`^[${empties}]+`), '');
						}
						if (childes.length < 2 || (i > 0 && i === childes.length - 1)) {
							text = text.replace(new RegExp(`[${empties}]+$`), '');
						}

						replace.push(writer.createText(text, attrs));
					} else {
						replace.push(node);
					}

					writer.remove(node);
				});

				replace.forEach((n) => writer.append(n, block));
			}
		});
	}

	/**
	 * is it a picture, video or table
	 *
	 * @param block
	 * @returns {boolean}
	 */
	_exclude(block) {
		return ['image', 'media', 'table'].some((e) => block.is('element', e));
	}

	/**
	 * Whether is empty
	 *
	 * @param block
	 * @returns {Boolean|boolean|*}
	 */
	_isEmpty(block) {
		return block.isEmpty || (block.data && block.data.trim() === '');
	}

	/**
	 * begin with blank || end with blank || contains more than 2 white space characters
	 *
	 * @param block
	 * @returns {boolean}
	 */
	_has(block) {
		const text = Array.from(block.getChildren())
			.map((c) => c.data)
			.join('');

		return (
			new RegExp(`^[${empties}]+`).test(text) ||
			new RegExp(`[${empties}]+$`).test(text) ||
			new RegExp(`[${empties}]{2}`, 'g').test(text)
		);
	}

	/**
	 * Identify whether the clearSpace button can be executed
	 *
	 * @param iterator
	 * @return {boolean}
	 */
	_executable(iterator) {
		const first = findFirst(
			iterator,
			(item) => !(this._isEmpty(item) || this._exclude(item)) && this._has(item),
			EXCLIDEBLOCK
		);
		return !!first;
	}
}
