export function getIndicesOf(searchStr, str, caseSensitive) {
	const searchStrLen = searchStr.length;
	if (searchStrLen === 0) {
		return [];
	}
	let startIndex = 0;
	let index;
	const indices = [];
	if (!caseSensitive) {
		str = str.toLowerCase();
		searchStr = searchStr.toLowerCase();
	}
	while ((index = str.indexOf(searchStr, startIndex)) > -1) {
		indices.push(index);
		startIndex = index + searchStrLen;
	}
	return indices;
}
