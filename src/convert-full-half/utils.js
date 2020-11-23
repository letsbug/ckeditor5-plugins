/**
 * Full - and - half - corner character dictionaries
 *
 * @type {{half: string, full: string, halfEscaped: string}}
 */
const dictionary = {
	full: '【】。；，：“”‘’（）！？《》',
	half: `[].;,:""''()!?<>`,
	halfEscaped: `\\[\\]\\.;,:""''()!?<>`,
};

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
	return nodes.some((node) => hasFull(node.data) || hasHalf(node.data));
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
		str = str.replaceAll(char, dictionary[standby[type]].charAt(position));
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

	for (let i = 0; i < blocks.length; i++) {
		const block = blocks[i];
		if (block.isEmpty) {
			continue;
		}

		const nodes = Array.from(block.getChildren());
		if (!nodes.length) {
			continue;
		}

		for (let j = 0; j < nodes.length; j++) {
			const node = nodes[j];
			if (!node.is('$text')) {
				continue;
			}

			const data = node.data;
			let matched = data.match(new RegExp(`[${dictionary.full}${dictionary.halfEscaped}]`));
			if (matched && matched.length) {
				type = dictionary.full.includes(matched[0]) ? 'full' : 'half';
				break;
			}
		}

		if (type) {
			break;
		}
	}

	return type;
}

/**
 * Identify whether the selections can be convert characters
 *
 * @param blocks
 * @returns {boolean}
 */
export function convertFullHalfExecutable(blocks) {
	return blocks.some(
		(b) => !b.isEmpty && !['media, image', 'table'].includes(b.name) && checkNodes(Array.from(b.getChildren()))
	);
}

/**
 * Execute convert Full - and - half - corner character
 *
 * @param writer
 * @param block
 * @param type {'full'|'half'}
 */
export function convertFullHalf(writer, block, type) {
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
