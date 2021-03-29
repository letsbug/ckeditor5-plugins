/**
 * @module convert-full-half/command
 */

import Command from '@ckeditor/ckeditor5-core/src/command';

const dictionary = {
	full: '《》（）【】。？！；，：“”‘’',
	half: `<>()[].?!;,:""''`,
	halfEscaped: `\\<\\>\\(\\)\\[\\]\\.\\?\\!;,:""''`,
};

export default class ConvertFullHalfCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const start = selection.getFirstPosition();
		const end = selection.getLastPosition();
		if (!start || !end) {
			this.isEnabled = false;
			this.range = null;
			return;
		}

		this.range = model.createRange(start, end);
		this.isEnabled = this._executable();
	}

	/**
	 * Executes the command. convert half to full or full to half.
	 *
	 * @param options
	 */
	execute(options = {}) {
		if (!this.range) {
			return;
		}

		const model = this.editor.model;
		const type = options.type || this.value;

		model.change((writer) => {
			for (const walker of this.range.getWalker()) {
				const textNode = walker.item.textNode;
				if (!textNode) {
					continue;
				}

				const text = walker.item.data;
				const matcher = new RegExp(`[${dictionary[{ full: 'full', half: 'halfEscaped' }[type]]}]`, 'g');
				const matched = text.match(matcher);
				if (!matched || !matched.length) {
					continue;
				}

				// **Note** "textNode.getPath()" return [number, number]: [witch paragraph, start of "textNode" in paragraph]
				const base = textNode.getPath()[1] || 0;
				const start = textNode.data.indexOf(text);
				const end = textNode.data.lastIndexOf(text);
				const range = writer.createRange(
					writer.createPositionAt(textNode.parent, ~start ? base + start : textNode.startOffset),
					writer.createPositionAt(textNode.parent, ~end ? base + end + text.length : textNode.endOffset)
				);
				let replace = text;

				for (const char of matched) {
					const position = dictionary[type].indexOf(char);
					let _regStr = `${char}`;
					if (['<', '>', '(', ')', '[', ']', '.', '?', '!'].includes(char)) {
						_regStr = '\\' + _regStr;
					}
					replace = replace.replace(
						new RegExp(_regStr, 'g'),
						dictionary[{ full: 'half', half: 'full' }[type]].charAt(position)
					);
				}
				model.insertContent(writer.createText(replace), range);
			}

			writer.setSelection(this.range);
		});
	}

	/**
	 * Identify whether the selections can be convert characters
	 *
	 * @returns {boolean}
	 */
	_executable() {
		for (const walker of this.range.getWalker()) {
			const textNode = walker.item.textNode;
			if (!textNode) {
				continue;
			}

			const text = walker.item.data;
			const matched = text.match(new RegExp(`[${dictionary.full}${dictionary.halfEscaped}]`));
			if (matched && matched.length) {
				this.value = dictionary.full.includes(matched[0]) ? 'full' : 'half';
				return true;
			}
		}

		return false;
	}
}
