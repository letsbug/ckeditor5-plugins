import { Command } from '@ckeditor/ckeditor5-core';
import { findIndicesOf } from '../utils';

export default class HighlightOrientedCommand extends Command {
	/**
	 * @inheritDoc
	 * @param {object} options
	 * @param {'highlight'|'remove'} options.type
	 * @param {HighlightOrientedItem[]} [options.items]
	 * @param {boolean} [options.caseSensitive]
	 */
	execute(options) {
		const { type, items, caseSensitive } = options;

		if (type === 'remove') {
			this.editor.execute('highlight');
		}

		for (const item of items) {
			this._findAndHighlight(item, caseSensitive);
		}
	}

	/**
	 * find words
	 *
	 * @param {HighlightOrientedItem} item words
	 * @param {boolean} [caseSensitive]
	 * @private
	 */
	_findAndHighlight(item, caseSensitive) {
		const model = this.editor.model;
		const { words, marker } = item;
		console.log(words, marker);

		const range = model.createRangeIn(model.document.getRoot());
		model.change((writer) => {
			for (const walker of range.getWalker()) {
				const textNode = walker.item.textNode;

				if (!textNode) {
					continue;
				}

				const text = walker.item.data;
				for (const word of words) {
					const indices = findIndicesOf(word, text, caseSensitive);
					for (const index of indices) {
						const startIndex = textNode.startOffset + index;
						const start = writer.createPositionAt(textNode.parent, startIndex);
						const end = writer.createPositionAt(textNode.parent, startIndex + word.length);
						writer.createSelection(writer.createRange(start, end));
						this.editor.execute('highlight', { value: marker + 'Marker' });
					}
				}
			}
		});
	}
}

/**
 * @typedef HighlightOrientedItem
 *
 * @param {string[]} words highlight target words
 * @param {string} marker which color marker about these words
 */

// * @param {boolean} [caseSensitive] strictly match the case of letters
