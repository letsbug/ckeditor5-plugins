/**
 * @module find-replace/index
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FindReplaceUI from './ui';
import FindReplaceEditing from './editing';
import '../../theme/find-replace.css';

export const ATTRIBUTE = 'findReplace';
export const SEARCH_MARKER = 'SEARCH';
export const CURRENT_MARKER = 'CURRENT';

export default class FindReplace extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [FindReplaceUI, FindReplaceEditing];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FindReplace';
	}
}
