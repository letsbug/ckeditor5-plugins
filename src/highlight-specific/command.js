import { Command } from '@ckeditor/ckeditor5-core';
import { updateResultFromRange } from './utils';

export class HighlightSpecificCommand extends Command {
	/**
	 * @inheritDoc
	 *
	 * @param {module:core/editor/editor~Editor} editor
	 * @param state
	 */
	constructor(editor, state) {
		super(editor);

		this.isEnabled = true;

		// 不能影响数据，须开启只读模式
		// https://ckeditor.com/docs/ckeditor5/latest/api/module_core_command-Command.html#member-affectsData
		this.affectsData = false;

		this._state = state;
	}

	/**
	 * @param {Object} options
	 * @param {Array<string>} options.words
	 * @param {string} [options.color]
	 * @fires execute
	 */
	execute(options) {
		if (!(options?.words instanceof Array) || !options?.words.length) {
			return;
		}
		const { editor } = this;
		const { model } = editor;
		const { words, color = 'yellow' } = options;

		const config = editor.config.get('highlightSpecific');

		if (!config[color]) {
			console.warn(`The "${color}" color is not defined, this highlight operate will be ignore!`);
			return;
		}

		if (this._state[color].length) {
			this._state.clear(model, color);
		}

		words.forEach((word) => {
			if (!word) {
				return;
			}
			const results = model.document.getRootNames().reduce((currResult, rootName) => {
				return updateResultFromRange(
					model.createRangeIn(model.document.getRoot(rootName)),
					model,
					currResult,
					word,
					color
				);
			}, null);

			this._state[color].addMany(Array.from(results));
		});

		/*const results = */
		// console.warn(results);
	}
}
