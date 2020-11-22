/**
 * @module quick-style/index
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import QuickStyleUI from './ui';
import QuickStyleEditing from './editing';

export const ATTRIBUTE = 'quickStyle';
export const STORAGE_KEY = 'ck-quick-style-pref';

export default class QuickStyle extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [QuickStyleEditing, QuickStyleUI];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'QuickStyle';
	}
}
