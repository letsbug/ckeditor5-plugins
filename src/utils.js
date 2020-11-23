/**
 * Find the first successful validation object
 *
 * @param iterator
 * @param success
 * @returns {null|*}
 */
export function findFirst(iterator, success) {
	const item = iterator.next();

	if (item.done) {
		return null;
	}

	const value = item.value;
	if (success(value)) {
		return value;
	}

	return findFirst(iterator, success);
}
