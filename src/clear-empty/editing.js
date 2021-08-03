/**
 * @module clear-empty/editing
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ClearEmptyCommand } from './command';
import { ATTRIBUTE } from './index';

export class ClearEmptyEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearEmptyEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.commands.add(ATTRIBUTE, new ClearEmptyCommand(editor));
	}
}
