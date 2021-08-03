/**
 * @module extensions/extensions
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ExtensionsUI } from './ui';

class Extensions extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ExtensionsUI];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Extensions';
	}
}

export { ExtensionsUI, Extensions };
