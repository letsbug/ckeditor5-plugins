/**
 * @module extensions/ui
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

export class ExtensionsUI extends Plugin {
	static get pluginName() {
		return 'ExtensionsUI';
	}

	init() {
		const editor = this.editor;
		const _options = editor.config.get('extensions');
		const options = _options instanceof Array ? _options.filter((o) => o.name && typeof o.name === 'string') : [];

		options.forEach((o) => this._addItemButton(o));
	}

	_addItemButton(option) {
		const editor = this.editor;
		const { name, icon, label, command } = option;

		editor.ui.componentFactory.add(`${name}`, (locale) => {
			const button = new ButtonView(locale);

			button.set({ label, icon, tooltip: true });

			this.listenTo(button, 'execute', () => {
				if (!command) {
					console.warn(`[${name}] extension feature no callback configuration can be executed.`);
					return;
				}
				const imageUtils = editor.plugins.get('ImageUtils');
				if (!imageUtils.getClosestSelectedImageWidget(editor.editing.view.document.selection)) {
					command.call(editor, editor.model.document.selection.getSelectedElement());
					return;
				}

				/**
				 * 当光标处在 image caption 当中时，简单的通过 "editor.model.document.selection.getSelectedElement" 是无法获取图片元素的
				 * 始终需要通过 imageUtils.getClosestSelectedImageElement 来获取实际的图片元素
				 */
				command.call(editor, imageUtils.getClosestSelectedImageElement(editor.model.document.selection));
			});

			return button;
		});
	}
}
