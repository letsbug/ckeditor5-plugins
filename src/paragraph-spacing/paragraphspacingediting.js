/**
 * @module indent-first/paragraphspacingediting
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ParagraphSpacingCommand from './paragraphspacingcommand';
import { buildDefinition, isSupported } from '../line-height/utils';

export default class ParagraphSpacingEditing extends Plugin {
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

		editor.config.define('lineHeight', {
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
		schema.extend('$block', { allowAttributes: 'paragraphSpacing' });
		editor.model.schema.setAttributeProperties('paragraphSpacing', { isFormatting: true });

		const definition = buildDefinition(enabledOptions, unit);
		editor.conversion.attributeToAttribute(definition);
		editor.commands.add('paragraphSpacing', new ParagraphSpacingCommand(editor));
	}
}
