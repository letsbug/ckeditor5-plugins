/**
 * @module paragraph-spacing/editing
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ParagraphSpacingCommand } from './command';
import { buildDefinition, isSupported } from '../utils';
import { ATTRIBUTE } from './index';

export class ParagraphSpacingEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ParagraphSpacingEditing';
	}

	/**
	 * @inheritDoc
	 */
	constructor(editor) {
		super(editor);

		editor.config.define(ATTRIBUTE, {
			options: ['Default', 10, 20, 30, 40, 50],
			unit: 'px',
		});
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;

		// Filter out unsupported options.
		const enabledOptions = editor.config
			.get('paragraphSpacing.options')
			.map((option) => String(option))
			.filter(isSupported); // filter
		let unit = editor.config.get('paragraphSpacing.unit') || 'px';
		if (unit && unit !== 'px' && unit !== '%') {
			unit = 'px';
		}

		// Allow alignment attribute on all blocks.
		schema.extend('$block', { allowAttributes: ATTRIBUTE });
		editor.model.schema.setAttributeProperties(ATTRIBUTE, { isFormatting: true });

		const definition = buildDefinition(enabledOptions, unit, ATTRIBUTE);
		editor.conversion.attributeToAttribute(definition);
		editor.commands.add(ATTRIBUTE, new ParagraphSpacingCommand(editor));
	}
}
