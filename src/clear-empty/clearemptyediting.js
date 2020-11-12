/**
 * @module clear-empty/clearemptyediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearEmptyCommand from './clearemptycommand';

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
		// const schema = editor.model.schema;
		editor.commands.add('clearEmpty', new ClearEmptyCommand(editor));
	}
}
