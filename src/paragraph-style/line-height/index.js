/**
 * @module line-height/index
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import LineHeightEditing from './editing';
import LineHeightUI from './ui';

export const ATTRIBUTE = 'lineHeight';

export default class LineHeight extends Plugin {
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
