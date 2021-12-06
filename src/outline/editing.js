import { Plugin } from '@ckeditor/ckeditor5-core';
import { OutlineCommand } from './command';

const OUTLINE = 'outline';

export class OutlineEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'OutlineEditing';
	}

	/**
	 * @inheritDoc
	 * @return {Promise<void> | void}
	 */
	init() {
		const editor = this.editor;
		const conversion = editor.conversion;
		editor.model.schema.extend('$text', { allowAttributes: OUTLINE });
		editor.model.schema.setAttributeProperties(OUTLINE, {
			isFormatting: true,
			copyOnEnter: true,
		});

		conversion.for('downcast').attributeToElement({
			model: OUTLINE,
			view: (val, { writer }) => {
				return writer.createAttributeElement('span', { style: 'border: solid 1px #000000;' });
			},
		});

		editor.commands.add(OUTLINE, new OutlineCommand(editor));

		editor.keystrokes.set('CTRL+SHIFT+O', OUTLINE);
	}
}
