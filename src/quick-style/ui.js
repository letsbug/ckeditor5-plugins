/**
 * @module quick-style/ui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export default class QuickStyleUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'QuickStyleUI';
	}
}
