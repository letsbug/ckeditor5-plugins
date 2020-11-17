/**
 * @module soft-break-to-enter/softbreaktoenterediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import SoftBreakToEnterCommand from './softbreaktoentercommand';
import { ATTRIBUTE } from './softbreaktoenter';

export default class SoftBreakToEnterEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SoftBreakToEnterEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.commands.add(ATTRIBUTE, new SoftBreakToEnterCommand(editor));
	}
}
