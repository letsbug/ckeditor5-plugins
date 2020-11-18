/**
 * @module clear-empty/index
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearEmptyUI from './ui';
import ClearEmptyEditing from './editing';

export const ATTRIBUTE = 'clearEmpty';

export default class ClearEmpty extends Plugin {
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
