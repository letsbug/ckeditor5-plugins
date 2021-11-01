import { Plugin } from '@ckeditor/ckeditor5-core';
import { HighlightSpecificEditing } from './editing';

export class HighlightSpecific extends Plugin {
	static get requires() {
		return [HighlightSpecificEditing];
	}

	static get pluginName() {
		return 'HighlightSpecific';
	}
}

/**
 * HighlightSpecificConfig
 *
 * @typedef HighlightSpecificConfig
 * @type {Record<string, string>}
 */
