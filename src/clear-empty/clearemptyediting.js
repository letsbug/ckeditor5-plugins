/**
 * @module clear-empty/clearemptyediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearEmptyCommand from './clearemptycommand';
import { ATTRIBUTE } from './clearempty';

export default class ClearEmptyEditing extends Plugin {
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
