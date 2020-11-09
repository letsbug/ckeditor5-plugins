import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { isSupported, normalizeOptions } from './utils';
import LineHeightIcon from '../../theme/icons/line-height.svg';

export default class LineHeightUI extends Plugin {
	init() {
		const editor = this.editor;

		const options = this._getLocalizedOptions();

		const command = editor.commands.get('lineHeight');

		// Register UI component.
		editor.ui.componentFactory.add('lineHeight', (locale) => {
			const dropdownView = createDropdown(locale);
			addListToDropdown(dropdownView, _prepareListOptions(options, command));

			// Create dropdown model.
			dropdownView.buttonView.set({
				label: '行高',
				icon: LineHeightIcon,
				tooltip: true,
			});

			dropdownView.extendTemplate({
				attributes: {
					class: ['ckeditor5-line-height-dropdown'],
				},
			});

			dropdownView.bind('isEnabled').to(command);

			// Execute command when an item from the dropdown is selected.
			this.listenTo(dropdownView, 'execute', (evt) => {
				editor.execute(evt.source.commandName, { value: evt.source.commandParam });
				editor.editing.view.focus();
			});

			return dropdownView;
		});
	}

	_getLocalizedOptions() {
		const editor = this.editor;
		const localizedTitles = {
			Default: '默认行距',
		};

		const configs = editor.config.get('lineHeight.options').filter((option) => isSupported(option));
		if (!configs.includes('Default')) {
			configs.unshift('Default');
		}

		return normalizeOptions(configs).map((option) => {
			const title = localizedTitles[option.title];
			return title && title !== option.title ? Object.assign({}, option, { title }) : option;
		});
	}
}

function _prepareListOptions(options, command) {
	const itemDefinitions = new Collection();

	for (const option of options) {
		const def = {
			type: 'button',
			model: new Model({
				commandName: 'lineHeight',
				commandParam: option.model,
				label: option.title,
				class: 'ckeditor5-lineHeight-dropdown',
				withText: true,
			}),
		};

		if (option.view && option.view.classes) {
			def.model.set('class', `${def.model.class} ${option.view.classes}`);
		}

		def.model.bind('isOn').to(command, 'value', (value) => {
			const newValue = value ? parseFloat(value) : value;
			return newValue === option.model;
		});

		// Add the option to the collection.
		itemDefinitions.add(def);
	}

	return itemDefinitions;
}
