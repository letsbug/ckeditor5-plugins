/**
 * @module paragraph-spacing/index
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import ParagraphSpacingEditing from './editing';
import ParagraphSpacingUI from './ui';

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
