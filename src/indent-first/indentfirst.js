/**
 * @module indent-first/indentfirst
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import IndentFirstEditing from './indentfirstediting';
import IndentFirstUi from './indentfirstui';

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
