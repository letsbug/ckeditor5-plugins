/**
 * @module clear-space/clearspace
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ClearSpaceUI from './clearspaceui';
import ClearSpaceEditing from './clearspaceediting';

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
