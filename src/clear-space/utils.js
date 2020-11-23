// All white space characters except '\n'
const empties = ' \\f\\r\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff';
const excludes = ['image', 'media', 'table'];

/**
 * is it a picture, video or table
 *
 * @param block
 * @returns {boolean}
 */
function inExclude(block) {
	return excludes.some((e) => block.is('element', e));
}

/**
 * Whether is empty
 *
 * @param block
 * @returns {Boolean|boolean|*}
 */
function isEmpty(block) {
	return block.isEmpty || (block.data && block.data.trim() === '');
}

/**
 * begin with blank || end with blank || contains more than 2 white space characters
 *
 * @param block
 * @returns {boolean}
 */
function hasSpaces(block) {
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
 * @param blocks
 * @return {boolean}
 */
export function clearSpaceExecutable(blocks) {
	return blocks.some((b) => !(isEmpty(b) || inExclude(b)) && hasSpaces(b));
}

/**
 * Execute clear space command
 *
 * @param writer
 * @param block
 */
export function clearSpace(writer, block) {
	if (excludes.some((e) => block.is('element', e))) {
		return;
	}

	const childes = Array.from(block.getChildren());
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
