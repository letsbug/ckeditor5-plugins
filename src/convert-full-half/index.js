/**
 * @module convert-full-half/index
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { ConvertFullHalfUI } from './ui';
import { ConvertFullHalfEditing } from './editing';

const ATTRIBUTE = 'convertFullHalf';

class ConvertFullHalf extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [ConvertFullHalfUI, ConvertFullHalfEditing];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ConvertFullHalf';
	}
}

export { ATTRIBUTE, ConvertFullHalfUI, ConvertFullHalfEditing, ConvertFullHalf };
