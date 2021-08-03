/**
 * @module find-replace/index
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { FindReplaceUI } from './ui';
import { FindReplaceEditing } from './editing';
import '../../theme/find-replace.css';

const ATTRIBUTE = 'findReplace';
const SEARCH_MARKER = 'SEARCH';
const CURRENT_MARKER = 'CURRENT';

class FindReplace extends Plugin {
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

export { ATTRIBUTE, SEARCH_MARKER, CURRENT_MARKER, FindReplaceUI, FindReplaceEditing, FindReplace };
