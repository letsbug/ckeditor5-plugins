/**
 * @module clear-space/index
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearSpaceUI from './ui';
import ClearSpaceEditing from './editing';

export const ATTRIBUTE = 'clearSpace';

export default class ClearSpace extends Plugin {
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
