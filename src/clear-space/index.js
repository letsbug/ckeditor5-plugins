/**
 * @module clear-space/index
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ClearSpaceUI } from './ui';
import { ClearSpaceEditing } from './editing';

const ATTRIBUTE = 'clearSpace';

class ClearSpace extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ClearSpaceUI, ClearSpaceEditing];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearSpace';
	}
}

export { ATTRIBUTE, ClearSpaceUI, ClearSpaceEditing, ClearSpace };
