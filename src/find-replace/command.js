/**
 * @module find-replace/command
 */

import { Command } from '@ckeditor/ckeditor5-core';
import { CURRENT_MARKER, SEARCH_MARKER } from './index';
import { scrollViewportToShowTarget } from '@ckeditor/ckeditor5-utils/src/dom/scroll';
import { findIndicesOf } from '../utils';

export default class FindReplaceCommand extends Command {
	/**
	 * @inheritDoc
	 * @param {Object} options
	 * @param {'find' | 'replace' | 'replaceAll' | 'reset'} [options.type]
	 * @param {'prev' | 'next' | 'none'} [options.position]
	 * @param {string[] | module:ui/labeledfield~LabeledFieldView} [options.key]
	 * @param {string | module:ui/labeledfield~LabeledFieldView} [options.replace]
	 */
	execute(options = {}) {
		const { type, position, key, replace } = Object.assign(
			{ type: 'reset', position: 'none', key: [], replace: '' },
			options
		);

		switch (type) {
			case 'find':
				this._find(key, position === 'prev' ? -1 : position === 'next' ? 1 : 0);
				break;
			case 'replace':
				this._replace(key, replace);
				break;
			case 'replaceAll':
				this._replaceAll(key, replace);
				break;
			case 'reset':
				this._resetStatus();
				break;
		}
	}

	_scrollTo(marker) {
		if (!marker) {
			return;
		}

		this.editor.model.change((writer) => {
			this._removeCurrentSearchMarker(writer);
			this.currentSearchMarker = writer.addMarker(CURRENT_MARKER, {
				range: marker.getRange(),
				usingOperation: false,
			});
		});
		const viewRange = this.editor.editing.mapper.toViewRange(marker.getRange());
		const domRange = this.editor.editing.view.domConverter.viewRangeToDom(viewRange);
		scrollViewportToShowTarget({ target: domRange, viewportOffset: 130 });
	}

	_isSameSearch(values, markers) {
		const fullVal = values.join(' ');
		// eslint-disable-next-line no-undef
		const markersMerge = Array.from(new Set(markers.map((marker) => marker.name.split(':')[1]))).join(' ');
		// search:searchTerm:counter
		return fullVal === markersMerge;
	}

	_splitInputs(findField) {
		return findField.fieldView.element.value.trim().split(' ');
	}

	_find(findField, increment) {
		const model = this.editor.model;
		const values = findField instanceof Array ? findField : this._splitInputs(findField);
		// if (values.length > 1 && /(\S+) (\S+)/.test(searchTerm)) {
		// 	values.push(searchTerm);
		// }

		let markers = Array.from(model.markers.getMarkersGroup(SEARCH_MARKER));

		if (markers.length && this._isSameSearch(values, markers)) {
			// loop through the items
			this.currentSearchIndex = (this.currentSearchIndex + markers.length + increment) % markers.length;
		} else {
			this._resetStatus(findField);
			// Create a range spanning over the entire root content:
			const range = model.createRangeIn(model.document.getRoot());
			let counter = 0;
			model.change((writer) => {
				// Iterate over all items in this range:
				for (const value of range.getWalker()) {
					const textNode = value.item.textNode;
					if (!textNode) {
						continue;
					}

					const text = value.item.data;
					for (const val of values) {
						const indices = findIndicesOf(val, text, false);
						for (const index of indices) {
							const label = SEARCH_MARKER + ':' + val + ':' + counter++;
							const startIndex = textNode.startOffset + index;
							const start = writer.createPositionAt(textNode.parent, startIndex);
							const end = writer.createPositionAt(textNode.parent, startIndex + val.length);
							writer.addMarker(label, { range: writer.createRange(start, end), usingOperation: false });
						}
					}
				}
				// update markers variable after search
				markers = Array.from(model.markers.getMarkersGroup(SEARCH_MARKER));
			});
			this.currentSearchIndex = 0;
		}
		findField.infoText = markers && ~markers.length ? `${this.currentSearchIndex + 1}/${markers.length}` : '未找到';

		const currentMarker = markers[this.currentSearchIndex];
		this._scrollTo(currentMarker);
		return currentMarker;
	}

	_resetStatus(findField, replaceField) {
		if (findField && !(findField instanceof Array)) findField.infoText = undefined;
		if (replaceField && typeof replaceField !== 'string') replaceField.infoText = undefined;
		this.currentSearchIndex = 0;
		const model = this.editor.model;
		model.change((writer) => {
			for (const searchMarker of model.markers.getMarkersGroup(SEARCH_MARKER)) {
				writer.removeMarker(searchMarker);
			}
			this._removeCurrentSearchMarker(writer);
		});
	}

	_removeCurrentSearchMarker(writer) {
		if (this.currentSearchMarker) {
			writer.removeMarker(this.currentSearchMarker);
			this.currentSearchMarker = undefined;
		}
	}

	_replace(findField, replaceField) {
		const model = this.editor.model;
		const markers = Array.from(model.markers.getMarkersGroup(SEARCH_MARKER));
		const values = findField instanceof Array ? findField : this._splitInputs(findField);
		const sameSearch = this._isSameSearch(values, markers);
		const currentMarker = sameSearch ? markers[this.currentSearchIndex] : this._find(values, 1);
		const replaceBy = typeof replaceField === 'string' ? replaceField : replaceField.fieldView.element.value;
		if (currentMarker && currentMarker.getRange) {
			model.change((writer) => {
				model.insertContent(writer.createText(replaceBy), currentMarker.getRange());
				writer.removeMarker(currentMarker);
				this._removeCurrentSearchMarker(writer);
			});
			// refresh the items...
			this._find(values, 0);
		}
	}

	_replaceAll(findField, replaceField) {
		const model = this.editor.model;
		const values = findField instanceof Array ? findField : this._splitInputs(findField);
		// fires the find operation to make sure the search is loaded before replace
		this._find(values, 1);
		const replaceBy = typeof replaceField === 'string' ? replaceField : replaceField.fieldView.element.value;
		model.change((writer) => {
			const markers = Array.from(model.markers.getMarkersGroup(SEARCH_MARKER));
			let size = 0;
			let len = markers.length;
			for (const marker of markers) {
				model.insertContent(writer.createText(replaceBy), marker.getRange());
				size++;
			}
			this._resetStatus(findField, replaceField);
			if (typeof replaceField !== 'string') replaceField.infoText = `${size}/${len}`;
		});
	}
}
