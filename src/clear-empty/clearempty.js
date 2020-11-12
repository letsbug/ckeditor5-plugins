/**
 * @module clear-empty/clearempty
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearEmptyUI from './clearemptyui';
import ClearEmptyEditing from './clearemptyediting';

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
