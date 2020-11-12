/**
 * judgment whether the clearEmpty button can be executed
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
		return text.trim() === '';
	});
}

/**
 * Execute clear empty command
 *
 * @param writer
 * @param blocks
 */
export function clearSpace(writer, blocks) {
	blocks.forEach((b) => {
		if (b.is('element', 'image') || b.is('element', 'media')) {
			return;
		}

		const childes = Array.from(b.getChildren());
		const texts = childes.map((c) => c.data).join('');
		writer.appendChild(texts.trim(), b);
	});
}
