import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { isSupported, buildDefinition } from './utils';
import LineHeightCommand from './lineheightcommand';

export default class LineHeightEditing extends Plugin {
	constructor(editor) {
		super(editor);

		editor.config.define('lineHeight', {
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

		// Allow alignment attribute on all blocks.
		schema.extend('$block', { allowAttributes: 'lineHeight' });
		editor.model.schema.setAttributeProperties('lineHeight', { isFormatting: true });

		const definition = buildDefinition(enabledOptions);
		editor.conversion.attributeToAttribute(definition);
		editor.commands.add('lineHeight', new LineHeightCommand(editor));
	}
}
