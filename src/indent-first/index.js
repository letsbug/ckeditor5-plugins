/**
 * @module indent-first/index
 */
import { Plugin } from '@ckeditor/ckeditor5-core';

import IndentFirstEditing from './editing';
import IndentFirstUi from './ui';

export const ATTRIBUTE = 'indentFirst';

export default class IndentFirst extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [IndentFirstEditing, IndentFirstUi];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'IndentFirst';
	}
}
