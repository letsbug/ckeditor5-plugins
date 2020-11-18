/**
 * @module soft-break-to-enter/index
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import SoftBreakToEnterUI from './ui';
import SoftBreakToEnterEditing from './editing';

export const ATTRIBUTE = 'softBreakToEnter';

export default class SoftBreakToEnter extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [SoftBreakToEnterUI, SoftBreakToEnterEditing];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SoftBreakToEnter';
	}
}
