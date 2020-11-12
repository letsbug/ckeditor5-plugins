/**
 * @module clear-space/clearspaceediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearSpaceCommand from './clearspacecommand';

export default class ClearSpaceEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearSpaceEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		// const schema = editor.model.schema;
		editor.commands.add('clearSpace', new ClearSpaceCommand(editor));
	}
}
