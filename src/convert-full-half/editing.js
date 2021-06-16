/**
 * @module convert-full-half/editing
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ATTRIBUTE } from './index';
import ConvertFullHalfCommand from './command';

export default class ConvertFullHalfEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ConvertFullHalfEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.commands.add(ATTRIBUTE, new ConvertFullHalfCommand(editor));
	}
}
