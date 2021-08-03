/**
 * @module clear-empty/index
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ClearEmptyUI } from './ui';
import { ClearEmptyEditing } from './editing';

const ATTRIBUTE = 'clearEmpty';

class ClearEmpty extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ClearEmptyUI, ClearEmptyEditing];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearEmpty';
	}
}

export { ATTRIBUTE, ClearEmptyUI, ClearEmptyEditing, ClearEmpty };
