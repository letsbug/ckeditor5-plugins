import { Plugin } from '@ckeditor/ckeditor5-core';
import FormatPainterUI from './ui';
import FormatPainterEditing from './editing';

export const ATTRIBUTE = 'formatPainter';

export default class FormatPainter extends Plugin {
	/**
	 * @inheritDoc
	 * @return {string}
	 */
	static get pluginName() {
		return 'FormatPainter';
	}

	/**
	 * @inheritDoc
	 * @return {(FormatPainterUI|FormatPainterEditing)[]}
	 */
	static get requires() {
		return [FormatPainterUI, FormatPainterEditing];
	}
}
