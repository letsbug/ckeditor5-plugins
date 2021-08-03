/**
 * @module soft-break-to-enter/editing
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { SoftBreakToEnterCommand } from './command';
import { ATTRIBUTE } from './index';

export class SoftBreakToEnterEditing extends Plugin {
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
