/**
 * @module extensions/ui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';

export default class ExtensionsUI extends Plugin {
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
				if (command) {
					command.call(editor, editor.model.document.selection.getSelectedElement());
				} else console.warn(`[${name}] extension feature no callback configuration can be executed.`);
			});

			return button;
		});
	}
}
