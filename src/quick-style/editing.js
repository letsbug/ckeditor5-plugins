/**
 * @module quick-style/editing
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class QuickStyleEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'QuickStyleEditing';
	}
}
