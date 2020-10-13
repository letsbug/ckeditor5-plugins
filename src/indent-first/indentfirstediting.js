/**
 * @module indent-first/indentfirstediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import IndentFirstCommand from './indentfirstcommand';

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
		schema.extend('$block', { allowAttributes: 'indentFirst' });
		editor.model.schema.setAttributeProperties('indentFirst', {
			isFormatting: true,
		});

		const definition = {
			model: {
				key: 'indentFirst',
				values: ['indentFirst'],
			},
			view: {
				indentFirst: {
					key: 'style',
					value: {
						'text-indent': indentFirstValue,
						// , width: '50%'
						// , margin: '5px'
					},
				},
			},
		};

		editor.conversion.attributeToAttribute(definition);

		editor.commands.add('indentFirst', new IndentFirstCommand(editor));
	}
}
