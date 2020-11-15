/**
 * judgment whether the clearSpace button can be executed
 *
 * @param blocks
 * @return {boolean}
 */
export function clearSpaceExecutable(blocks) {
	return blocks.some((b) => {
		if (b.isEmpty) {
			return true;
		}
		const text = Array.from(b.getChildren())
			.map((c) => c.data)
			.join('');
		// begin with blank || end with blanck || contains more than 2 white space characters
		// 以空白开头 || 以空白结尾 || 包含2个以上空白字符
		return /^\s+[\S\w]+/.test(text) || /[\S\w]+\s+$/.test(text) || /[\S\w]+?[\s]{2}[\S\w]+?/g.test(text);
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

		const props = {};
		Array.from(b.getAttributeKeys()).forEach((key) => {
			props[key] = b.getAttribute(key);
		});

		const replace = writer.createElement(b.name, props);
		const childes = Array.from(b.getChildren());

		childes.forEach((textNode, i) => {
			if (!textNode.is('$text')) {
				return;
			}

			const nats = {};
			Array.from(textNode.getAttributeKeys()).forEach((key) => {
				nats[key] = textNode.getAttribute(key);
			});

			let text = textNode.data.replace(/\s+/g, ' ');
			if (i === 0 || (i > 0 && /\s+$/.test(childes[i - 1].data))) {
				text = text.replace(/^\s+/, '');
			}
			if (i > 0 && i === childes.length - 1) {
				text = text.replace(/\s+$/, '');
			}

			writer.appendText(text, nats, replace);
		});

		writer.insert(replace, b, 'after');
		writer.remove(b);
	});
}
