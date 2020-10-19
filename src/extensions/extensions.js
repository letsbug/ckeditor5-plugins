import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ExtensionsEditing from './extensionsediting';
import ExtensionsUI from './extensionsui';

export default class Extensions extends Plugin {
	static get requires() {
		return [ExtensionsEditing, ExtensionsUI];
	}

	static get pluginName() {
		return 'Extensions';
	}
}
