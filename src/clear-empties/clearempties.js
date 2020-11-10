/**
 * @module clear-empties/clearempties
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearEmptiesUI from './clearemptiesui';
import ClearEmptiesEditing from './clearemptiesediting';

export default class ClearEmpties extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ClearEmptiesUI, ClearEmptiesEditing];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearEmpties';
	}
}
