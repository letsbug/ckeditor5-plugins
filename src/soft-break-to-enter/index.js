/**
 * @module soft-break-to-enter/index
 */
import { Plugin } from '@ckeditor/ckeditor5-core';

import { SoftBreakToEnterUI } from './ui';
import { SoftBreakToEnterEditing } from './editing';

const ATTRIBUTE = 'softBreakToEnter';

class SoftBreakToEnter extends Plugin {
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

export { ATTRIBUTE, SoftBreakToEnterUI, SoftBreakToEnterEditing, SoftBreakToEnter };
