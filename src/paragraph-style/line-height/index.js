/**
 * @module line-height/index
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { LineHeightEditing } from './editing';
import { LineHeightUI } from './ui';

const ATTRIBUTE = 'lineHeight';

class LineHeight extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [LineHeightEditing, LineHeightUI];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'LineHeight';
	}
}

export { ATTRIBUTE, LineHeightUI, LineHeightEditing, LineHeight };
