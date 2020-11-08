/**
 * @module indent-first/paragraphspacingediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ParagraphSpacingCommand from './paragraphspacingcommand';

export default class ParagraphSpacingEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ParagraphSpacingEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor(editor) {
		super(editor);
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		editor.commands.add('paragraphSpacing', new ParagraphSpacingCommand(editor));
	}
}
