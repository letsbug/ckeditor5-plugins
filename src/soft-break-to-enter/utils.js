/**
 * judgment whether the 'soft break to enter' button can be executed
 *
 * @param blocks
 */
export function softBreakToEnterExecutable(blocks) {
	return blocks.some((block) => Array.from(block.getChildren()).some((child) => child.name === 'softBreak'));
}

/**
 * execute 'soft break to enter' command
 * @param writer
 * @param blocks
 */
export function softBreakToEnter(writer, blocks) {
	blocks.forEach((block) => {
		const childes = block.getChildren();
		if (!childes.some((child) => child.name === 'softBreak')) {
			return;
		}

		let replace = writer.createElement(block.name, Object.fromEntries(block.getAttributes()));
		childes.forEach((child) => {
			const attrs = Object.fromEntries(child.getAttributes());
			if (child.is('$text')) {
				writer.appendText(child.data, attrs, replace);
			} else if (child.name !== 'softBreak') {
				writer.appendElement(child.name, attrs, replace);
				return;
			}

			console.log('will be the replace soft break character to enter');
			writer.insertBefore(replace);
			replace = writer.createElement(block.name, Object.fromEntries(block.getAttributes()));
		});
	});
}
