import { Plugin } from '@ckeditor/ckeditor5-core';
import { ATTRIBUTE } from './index';
import { FormatPainterCommand } from './command';

export class FormatPainterEditing extends Plugin {
	/**
	 * @inheritDoc
	 * @return {string}
	 */
	static get pluginName() {
		return 'formatPainterEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.commands.add(ATTRIBUTE, new FormatPainterCommand(editor));
	}
}
