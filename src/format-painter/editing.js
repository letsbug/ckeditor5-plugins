import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { ATTRIBUTE } from './index';
import FormatPainterCommand from './command';

export default class FormatPainterEditing extends Plugin {
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
