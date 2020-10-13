import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import { createDropdown, addListToDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { isSupported, normalizeOptions } from './utils';
import LineHeightIcon from '../../theme/icons/lineHeight.svg';

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
					class: ['p0thi-ckeditor5-lineHeight-dropdown'],
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
		const t = editor.t;

		const localizedTitles = {
			// Default: 'Standard'
			Default: t('Default'),
		};

		const options = normalizeOptions(editor.config.get('lineHeight.options').filter((option) => isSupported(option)));

		return options.map((option) => {
			const title = localizedTitles[option.title];

			if (title && title !== option.title) {
				// Clone the option to avoid altering the original `namedPresets` from `./utils.js`.
				option = Object.assign({}, option, { title });
			}

			return option;
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
				class: 'p0thi-ckeditor5-lineHeight-dropdown',
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
