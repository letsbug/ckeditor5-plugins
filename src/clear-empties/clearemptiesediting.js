/**
 * @module clear-empties/clearemptiesediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearEmptiesCommand from './clearemptiescommand';

export default class ClearEmptiesEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearEmptiesEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// const schema = editor.model.schema;
		editor.commands.add('clearEmpties', new ClearEmptiesCommand(editor));
	}
}
