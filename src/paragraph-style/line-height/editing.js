/**
 * @module line-height/editing
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { isSupported, buildDefinition } from '../utils';
import LineHeightCommand from './command';
import { ATTRIBUTE } from './index';

export default class LineHeightEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'LineHeightEditing';
	}

	constructor(editor) {
		super(editor);

		editor.config.define(ATTRIBUTE, {
			options: ['Default', 1, 2, 3, 4, 5],
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
			.get('lineHeight.options')
			.map((option) => String(option))
			.filter(isSupported); // filter
		let unit = editor.config.get('lineHeight.unit') || null;
		if (unit && unit !== 'px') {
			unit = null;
		}

		// Allow alignment attribute on all blocks.
		schema.extend('$block', { allowAttributes: ATTRIBUTE });
		editor.model.schema.setAttributeProperties(ATTRIBUTE, { isFormatting: true });

		const definition = buildDefinition(enabledOptions, unit, ATTRIBUTE);
		editor.conversion.attributeToAttribute(definition);
		editor.commands.add(ATTRIBUTE, new LineHeightCommand(editor));
	}
}
