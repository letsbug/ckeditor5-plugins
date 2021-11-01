import { Collection, uid } from '@ckeditor/ckeditor5-utils';
import { escapeRegExp } from 'lodash-es';

export function updateResultFromRange(range, model, start, word, color) {
	const results = start || new Collection();

	model.change((writer) => {
		[...range].forEach(({ type, item }) => {
			if (type !== 'elementStart' || !model.schema.checkChild(item, '$text')) {
				return;
			}

			const foundItems = findByTextCb(rangeToText(model.createRangeIn(item)), word);
			if (!foundItems) {
				return;
			}

			foundItems.forEach((foundItem) => {
				const resultId = `highlightSpecific:${color}:${uid()}`;
				const marker = writer.addMarker(resultId, {
					usingOperation: false,
					affectsData: false,
					range: writer.createRange(
						writer.createPositionAt(item, foundItem.start),
						writer.createPositionAt(item, foundItem.end)
					),
				});

				const index = findInsertIndex(results, marker);

				results.add({ id: resultId, label: foundItem.label, marker }, index);
			});
		});
	});

	return results;
}

export function rangeToText(range) {
	return Array.from(range.getItems()).reduce((mergeText, node) => {
		if (!(node.is('text') || node.is('textProxy'))) {
			return `${mergeText}\n`;
		}
		return mergeText + node.data;
	}, '');
}

export function findInsertIndex(resultsList, markerToInsert) {
	const result = resultsList.find(({ marker }) => markerToInsert.getStart().isBefore(marker.getStart()));

	return result ? resultsList.getIndex(result) : resultsList.length;
}

function regexpMatchToResult(result) {
	const lastIndex = result.length - 1;
	let startOffset = result.index;

	if (result.length === 3) {
		startOffset += result[1].length;
	}

	return {
		label: result[lastIndex],
		start: startOffset,
		end: startOffset + result[lastIndex].length,
	};
}

export function findByTextCb(searchTerm, searchText) {
	const query = `(${escapeRegExp(searchText)})`;
	const macher = new RegExp(query, 'gui');

	const matches = [...searchTerm.matchAll(macher)];
	return matches.map(regexpMatchToResult);
	// if () {}
}
