const excludes = ['image', 'media', 'table'];

/**
 * is it a picture, video or table
 *
 * @param block
 * @returns {boolean}
 */
function inExcludes(block) {
	return excludes.some((e) => block.is('element', e));
}

/**
 * block's content is empty
 *
 * @param block
 * @returns {boolean}
 */
function isEmpty(block) {
	const text = Array.from(block.getChildren())
		.map((c) => c.data)
		.join('');
	return text.trim() === '';
}

/**
 * judgment whether the clearEmpty button can be executed
 *
 * @param document
 * @return {boolean}
 */
export function clearEmptyExecutable(document) {
	const root = document.getRoot();
	if (root.childCount < 2) {
		return false;
	}

	const iterators = document.selection.getSelectedBlocks();
	if (!iterators) {
		return false;
	}
	// When the data is empty, there is a default <p> tag.
	return Array.from(iterators).some((b) => b.isEmpty || (!inExcludes(b) && isEmpty(b)));
}

/**
 * Execute clear empty command
 *
 * @param writer
 * @param block
 */
export function clearEmpty(writer, block) {
	if (excludes.some((e) => block.is('element', e))) {
		return;
	}
	if (block.isEmpty) {
		writer.remove(block);
		return;
	}

	const childes = Array.from(block.getChildren());
	const texts = childes.map((c) => c.data).join('');
	if (texts.trim() === '') {
		writer.remove(block);
	}
}
