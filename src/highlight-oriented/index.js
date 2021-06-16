/**
 * @module highlight-oriented/index
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { Highlight } from '@ckeditor/ckeditor5-highlight';
import HighlightOrientedCommand from './command';

export default class HighlightOriented extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HighlightOriented';
	}

	static get requires() {
		return [Highlight];
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.commands.add('highlightOriented', new HighlightOrientedCommand(editor));
	}
}
