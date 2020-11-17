/**
 * @module soft-break-to-enter/softbreaktoenter
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import SoftBreakToEnterUI from './softbreaktoenterui';
import SoftBreakToEnterEditing from './softbreaktoenterediting';

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
