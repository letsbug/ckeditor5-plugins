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
		// const factory = editor.ui.componentFactory;
		const _options = editor.config.get('extensions');
		const options = _options instanceof Array ? _options.filter((o) => o.name && typeof o.name === 'string') : [];

		options.forEach((o) => this._addItemButton(o));

		// factory.add('outsideCalls', (locale) => {
		// 	const dropdown = createDropdown(locale);
		//
		// 	if (options.length > 0) {
		// 		const items = options.map((o) => factory.create(`outsideCalls:${o.name}`));
		// 		addToolbarToDropdown(dropdown, items);
		// 	}
		//
		// 	dropdown.buttonView.set({
		// 		label: '扩展功能',
		// 		icon: OutsideCallsIcon,
		// 		tooltip: true,
		// 	});
		//
		// 	dropdown.toolbarView.isVertical = true;
		// 	dropdown.toolbarView.ariaLabel = '扩展功能工具栏';
		//
		// 	dropdown.extendTemplate({
		// 		attributes: { class: 'ck-outside-calls-dropdown' },
		// 	});
		//
		// 	return dropdown;
		// });
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
