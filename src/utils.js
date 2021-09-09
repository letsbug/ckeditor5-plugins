export const EXCLIDEBLOCK = 'imageBlock';
/**
 * Find the first successful validation object
 *
 * @param iterator
 * @param success
 * @returns {null|*}
 */
 export function findFirst(iterator, success, nameBlock) {
	const item = iterator.next();

	if (item.done) {
		return null;
	}

	const value = item.value;
	if(nameBlock && value.name === nameBlock) {
		return findFirst(iterator, success, nameBlock);
	}
	if (success(value)) {
		return value;
	}

	return findFirst(iterator, success);
}

/**
 * Find the position (interval) of a text/word in a string
 *
 * @param {string} word target word
 * @param {string} text target string text
 * @param {boolean} caseSensitive
 */
export function findIndicesOf(word, text, caseSensitive) {
	const searchStrLen = word.length;
	if (searchStrLen === 0) {
		return [];
	}

	let startIndex = 0;
	let index;
	const indices = [];
	if (!caseSensitive) {
		text = text.toLowerCase();
		word = word.toLowerCase();
	}
	while ((index = text.indexOf(word, startIndex)) > -1) {
		indices.push(index);
		startIndex = index + searchStrLen;
	}
	return indices;
}
