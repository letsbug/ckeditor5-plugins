/**
 * judgment whether the clearEmpty button can be executed
 *
 * @param blocks
 * @return {boolean}
 */
export function clearEmptyExecutable(blocks) {
	return blocks.some((b) => {
		if (b.is('element', 'image') || b.is('element', 'media') || b.is('element', 'table')) {
			return false;
		}
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
export function clearEmpty(writer, blocks) {
	blocks.forEach((b) => {
		if (b.is('element', 'image') || b.is('element', 'media') || b.is('element', 'table')) {
			return;
		}
		if (b.isEmpty) {
			writer.remove(b);
			return;
		}

		const childes = Array.from(b.getChildren());
		const texts = childes.map((c) => c.data).join('');
		if (texts.trim() === '') {
			writer.remove(b);
		}
	});
}
