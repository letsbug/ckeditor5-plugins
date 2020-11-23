/**
 * Identify whether the 'soft break to enter' button can be executed
 *
 * @param blocks
 */
export function softBreakToEnterExecutable(blocks) {
	return blocks.some((block) => Array.from(block.getChildren()).some((child) => child.name === 'softBreak'));
}

/**
 * reset replace element
 *
 * @param writer
 * @param block
 * @returns {module:engine/view/element~Element|module:engine/model/element~Element|HTMLElement|*|ActiveX.IXMLDOMElement}
 */
function resetReplace(writer, block) {
	return writer.createElement(block.name, Object.fromEntries(block.getAttributes()));
}

/**
 * execute 'soft break to enter' command
 * @param writer
 * @param block
 */
export function softBreakToEnter(writer, block) {
	const iterator = block.getChildren();
	if (!iterator) {
		return;
	}

	const childes = Array.from(iterator);
	if (childes.every((child) => child.name !== 'softBreak')) {
		return;
	}

	let replace = resetReplace(writer, block);
	let lastInsert = null;
	childes.forEach((child, i) => {
		const attrs = Object.fromEntries(child.getAttributes());

		if (child.is('$text')) {
			writer.appendText(child.data, attrs, replace);
		} else if (child.name !== 'softBreak') {
			writer.appendElement(child.name, attrs, replace);
		}

		if (child.name === 'softBreak' || i === childes.length - 1) {
			writer.insert(replace, writer.createPositionAfter(lastInsert || block));

			if (i < childes.length - 1 && child.name === 'softBreak') {
				lastInsert = replace;
				replace = resetReplace(writer, block);
			}
		}
	});

	writer.remove(block);
}
