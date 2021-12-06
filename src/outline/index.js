/**
 * @module outline/index
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { OutlineUi } from './ui';
import { OutlineEditing } from './editing';

class Outline extends Plugin {
	/**
	 * @inheritDoc
	 * @return {(OutlineUi|OutlineEditing)[]}
	 */
	static get requires() {
		return [OutlineUi, OutlineEditing];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Outline';
	}
}

export { Outline };
