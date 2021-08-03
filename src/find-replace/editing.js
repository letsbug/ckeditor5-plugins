/**
 * @module find-replace/editing
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ATTRIBUTE } from './index';
import { FindReplaceCommand } from './command';

export class FindReplaceEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FindReplaceEditing';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.commands.add(ATTRIBUTE, new FindReplaceCommand(editor));
	}
}
