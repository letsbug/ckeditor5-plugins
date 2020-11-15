// All white space characters except '\n'
const character = ' \\f\\r\\t\\v\\u00a0\\u1680\\u180e\\u2000-\\u200a\\u2028\\u2029\\u202f\\u205f\\u3000\\ufeff';

/**
 * judgment whether the clearSpace button can be executed
 *
 * @param blocks
 * @return {boolean}
 */
export function clearSpaceExecutable(blocks) {
	return blocks.some((b) => {
		if (b.isEmpty || (b.data && b.data.trim() === '')) {
			return false;
		}
		const text = Array.from(b.getChildren())
			.map((c) => c.data)
			.join('');
		// begin with blank || end with blanck || contains more than 2 white space characters
		// 以空白开头 || 以空白结尾 || 包含2个以上空白字符
		return new RegExp(`^[${character}]+`).test(text) || new RegExp(`[${character}]+$`).test(text) || new RegExp(`[${character}]{2}`, 'g').test(text);
	});
}

/**
 * Execute clear space command
 *
 * @param writer
 * @param blocks
 * /^([\s+])?.*([\s]{2})?.*([\s+])?$/
 */
export function clearSpace(writer, blocks) {
	blocks.forEach((b) => {
		if (b.is('element', 'image') || b.is('element', 'media')) {
			return;
		}

		const replace = writer.createElement(b.name, Object.fromEntries(b.getAttributes()));
		const childes = Array.from(b.getChildren());

		childes.forEach((node, i) => {
			const attrs = Object.fromEntries(node.getAttributes());
			if (node.is('$text')) {
				// let text = node.data.replace(/\s+/g, ' ');
				let text = node.data.replace(new RegExp(`[${character}]+`, 'g'), ' ');
				// if (i === 0 || (i > 0 && /\s+$/.test(childes[i - 1].data))) {
				if (i === 0 || (i > 0 && new RegExp(`[${character}]+$`).test(childes[i - 1].data))) {
					// text = text.replace(/^\s+/, '');
					text = text.replace(new RegExp(`^[${character}]+`), '');
				}
				if (i > 0 && i === childes.length - 1) {
					// text = text.replace(/\s+$/, '');
					text = text.replace(new RegExp(`[${character}]+$`), '');
				}

				writer.appendText(text, attrs, replace);
			} else {
				// May contain non-text element nodes (eg: softBreak)
				writer.appendElement(node.name, attrs, replace);
			}
		});

		writer.insert(replace, b, 'after');
		writer.remove(b);
	});
}
