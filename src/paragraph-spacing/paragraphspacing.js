/**
 * @module paragraph-spacing/paragraphspacing
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ParagraphSpacingEditing from './paragraphspacingediting';
import ParagraphSpacingUI from './paragraphspacingui';

export const ATTRIBUTE = 'paragraphSpacing';

export default class ParagraphSpacing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ParagraphSpacingEditing, ParagraphSpacingUI];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ParagraphSpacing';
	}
}
