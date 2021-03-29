/**
 * @module convert-full-half/command
 */

import Command from '@ckeditor/ckeditor5-core/src/command';
import { findFirst } from '../utils';

const dictionary = {
	full: '《》（）【】。？！；，：“”‘’',
	half: `<>()[].?!;,:""''`,
	halfEscaped: `\\<\\>\\(\\)\\[\\]\\.\\?\\!;,:""''`,
};

export default class ConvertFullHalfCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const iterator = this.editor.model.document.selection.getSelectedBlocks();

		if (!iterator) {
			this.isEnabled = false;
			return;
		}

		this.isEnabled = this._executable(this.editor.model.document.selection.getSelectedBlocks());
		if (!this.isEnabled) {
			return;
		}

		this.value = this._findExecuteType(iterator);
	}

	/**
	 * Executes the command. convert half to full or full to half.
	 *
	 * @param options
	 * @fires execute
	 */
	execute(options = {}) {
		const model = this.editor.model;
		const iterator = model.document.selection.getSelectedBlocks();
		const type = options.type || this.value;

		model.change((writer) => {
			for (const block of iterator) {
				if (this._exclude(block.name)) {
					continue;
				}

				const replace = [];
				for (const node of block.getChildren()) {
					if (node.is('$text')) {
						replace.push(writer.createText(this._cycle(node, type), node.getAttributes()));
					} else {
						replace.push(node);
					}
					writer.remove(node);
				}

				replace.forEach((n) => writer.append(n, block));
			}
		});
	}

	/**
	 * convert characters
	 * TODO need optimizes logics
	 *
	 * @param node {module:engine/model/node~Node}
	 * @param type {'full'|'half'}
	 */
	_cycle(node, type) {
		const old = node.data;
		const matcher = new RegExp(`[${type === 'full' ? dictionary.full : dictionary.halfEscaped}]`, 'g');
		const matched = old.matchAll(matcher);
		if (!matched) {
			return old;
		}

		const matchedArr = Array.from(matched);
		if (!matchedArr.length) {
			return old;
		}

		let str = old;
		const standby = {
			full: 'half',
			half: 'full',
		};
		matchedArr.forEach(([char]) => {
			const position = dictionary[type].indexOf(char);
			let _regStr = `${char}`;
			if (['<', '>', '(', ')', '[', ']', '.', '?', '!'].includes(char)) {
				_regStr = '\\' + _regStr;
			}
			str = str.replace(new RegExp(_regStr, 'g'), dictionary[standby[type]].charAt(position));
		});

		return str;
	}

	/**
	 * Find the convertFullHalf command execute type,
	 * If the first character found is a half Angle, the command performs a half Angle conversion,
	 * Otherwise, a full Angle conversion is performed.
	 *
	 * @param blocks
	 * @returns {String|null}
	 */
	_findExecuteType(blocks) {
		let type = null;

		const findFirstNode = (node) => {
			if (!node.is('$text')) {
				return false;
			}

			const data = node.data;
			let matched = data.match(new RegExp(`[${dictionary.full}${dictionary.halfEscaped}]`));
			if (matched && matched.length) {
				type = dictionary.full.includes(matched[0]) ? 'full' : 'half';
				return true;
			}

			return false;
		};

		findFirst(blocks, (block) => !block.isEmpty && findFirst(block.getChildren(), findFirstNode));

		return type;
	}

	_exclude(name) {
		return ['image', 'media', 'table'].includes(name);
	}

	/**
	 * Identify whether a string contains full-angle characters
	 *
	 * @param str
	 * @returns {boolean}
	 */
	_hasFull(str) {
		return new RegExp(`[${dictionary.full}]`, 'g').test(str);
	}

	/**
	 * Identify whether a string contains half-angle characters
	 *
	 * @param str
	 * @returns {boolean}
	 */
	_hasHalf(str) {
		return new RegExp(`[${dictionary.halfEscaped}]`, 'g').test(str);
	}

	/**
	 * Identify whether the node can be convert characters
	 *
	 * @param nodes
	 * @returns {boolean}
	 */
	_checkNodes(nodes) {
		const first = findFirst(nodes, (item) => this._hasFull(item.data) || this._hasHalf(item.data));
		return !!first;
	}

	/**
	 * Identify whether the selections can be convert characters
	 *
	 * @param iterator
	 * @returns {boolean}
	 */
	_executable(iterator) {
		const callback = (item) => !item.isEmpty && !this._exclude(item.name) && this._checkNodes(item.getChildren());
		return !!findFirst(iterator, callback);
	}
}
