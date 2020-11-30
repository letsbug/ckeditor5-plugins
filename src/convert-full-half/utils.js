/**
 * Full - and - half - corner character dictionaries
 *
 * @type {{half: string, full: string, halfEscaped: string}}
 */
import { findFirst } from '../utils';

const dictionary = {
	full: '【】。；，：“”‘’（）！？《》',
	half: `[].;,:""''()!?<>`,
	halfEscaped: `\\[\\]\\.;,:""''()!?<>`,
};

/**
 * this plugins will be continue when the block is image, media or table
 *
 * @type {string[]}
 */
const excludes = ['image', 'media', 'table'];

/**
 * Identify whether a string contains full-angle characters
 *
 * @param str
 * @returns {boolean}
 */
function hasFull(str) {
	return new RegExp(`[${dictionary.full}]`, 'g').test(str);
}

/**
 * Identify whether a string contains half-angle characters
 *
 * @param str
 * @returns {boolean}
 */
function hasHalf(str) {
	return new RegExp(`[${dictionary.halfEscaped}]`, 'g').test(str);
}

/**
 * Identify whether the node can be convert characters
 *
 * @param nodes
 * @returns {boolean}
 */
function checkNodes(nodes) {
	const first = findFirst(nodes, (item) => hasFull(item.data) || hasHalf(item.data));
	return !!first;
}

/**
 * convert characters
 * TODO need optimizes logics
 *
 * @param node {module:engine/model/node~Node}
 * @param type {'full'|'half'}
 */
function convertCycler(node, type) {
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
		str = str.replace(new RegExp(`${char}`, 'g'), dictionary[standby[type]].charAt(position));
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
export function findCommandExecuteType(blocks) {
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

/**
 * Identify whether the selections can be convert characters
 *
 * @param iterator
 * @returns {boolean}
 */
export function convertFullHalfExecutable(iterator) {
	const callback = (item) =>
		!item.isEmpty && !['media, image', 'table'].includes(item.name) && checkNodes(item.getChildren());
	return !!findFirst(iterator, callback);
}

/**
 * Execute convert Full - and - half - corner character
 *
 * @param writer
 * @param block
 * @param type {'full'|'half'}
 */
export function convertFullHalf(writer, block, type) {
	if (excludes.includes(block.name)) {
		return;
	}

	const iterator = block.getChildren();
	if (!iterator) {
		return;
	}

	const replace = [];
	Array.from(iterator).forEach((node) => {
		if (node.is('$text')) {
			replace.push(writer.createText(convertCycler(node, type), node.getAttributes()));
		} else {
			replace.push(node);
		}

		writer.remove(node);
	});

	replace.forEach((n) => writer.append(n, block));
}
