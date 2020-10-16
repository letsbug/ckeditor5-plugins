import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { addToolbarToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { isSupported } from './utils';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import OutsideCallsIcon from '../../theme/icons/outsideCalls.svg';

export default class OutsideCallsUI extends Plugin {
	static get pluginName() {
		return 'OutsideCallsUI';
	}

	init() {
		const editor = this.editor;
		const factory = editor.ui.componentFactory;
		const _options = editor.config.get('outsideCalls.options');
		const options = _options instanceof Array ? _options.filter(isSupported) : [];

		options.forEach((o) => this._addItemButton(o));

		factory.add('outsideCalls', (locale) => {
			const dropdown = createDropdown(locale);

			if (options.length > 0) {
				const items = options.map((o) => factory.create(`outsideCalls:${o.name}`));
				addToolbarToDropdown(dropdown, items);
			}

			dropdown.buttonView.set({
				label: '扩展功能',
				icon: OutsideCallsIcon,
				tooltip: true,
			});

			dropdown.toolbarView.isVertical = true;
			dropdown.toolbarView.ariaLabel = '扩展功能工具栏';

			dropdown.extendTemplate({
				attributes: { class: 'ck-outside-calls-dropdown' },
			});

			return dropdown;
		});
	}

	_addItemButton(option) {
		const editor = this.editor;
		const { name, icon, label, command } = option;

		editor.ui.componentFactory.add(`outsideCalls:${name}`, (locale) => {
			const button = new ButtonView(locale);

			button.set({ label, icon, tooltip: true });

			this.listenTo(button, 'execute', () => {
				command.call(editor);
			});

			return button;
		});
	}
}