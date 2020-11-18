/**
 * @module indent-first/editing
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import IndentFirstCommand from './command';
import { ATTRIBUTE } from './index';

export default class IndentFirstEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'IndentFirstEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor(editor) {
		super(editor);

		editor.config.define('indentFirstValue', '2em');
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;

		const indentFirstValue = editor.config.get('indentFirstValue');

		// Allow indentFirst attribute on all blocks.
		schema.extend('$block', { allowAttributes: ATTRIBUTE });
		editor.model.schema.setAttributeProperties(ATTRIBUTE, {
			isFormatting: true,
		});

		const definition = {
			model: {
				key: ATTRIBUTE,
				values: [ATTRIBUTE],
			},
			view: {
				indentFirst: {
					key: 'style',
					value: {
						'text-indent': indentFirstValue,
					},
				},
			},
		};

		editor.conversion.attributeToAttribute(definition);

		editor.commands.add(ATTRIBUTE, new IndentFirstCommand(editor));
	}
}
