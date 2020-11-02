/**
 * @module indent-first/extensions
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ExtensionsEditing from './extensionsediting';
import ExtensionsUI from './extensionsui';

export default class Extensions extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ExtensionsEditing, ExtensionsUI];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Extensions';
	}
}
