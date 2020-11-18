/**
 * @module paragraph-spacing/ui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import Model from '@ckeditor/ckeditor5-ui/src/model';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import { isSupported, normalizeOptions } from '../line-height/utils';
import { ATTRIBUTE } from './index';
import paragraphSpacingIcon from '../../theme/icons/paragraph-spacing.svg';

export default class ParagraphSpacingUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ParagraphSpacingUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const options = this._getLocalizedOptions();
		const command = editor.commands.get(ATTRIBUTE);

		editor.ui.componentFactory.add(ATTRIBUTE, (locale) => {
			const dropdown = createDropdown(locale);
			addListToDropdown(dropdown, this._prepareListOptions(options, command));

			dropdown.buttonView.set({
				label: '段落间距',
				icon: paragraphSpacingIcon,
				tooltip: true,
			});

			dropdown.extendTemplate({
				attributes: {
					class: ['ck-paragraph-spacing-dropdown'],
				},
			});

			dropdown.bind('isEnabled').to(command);

			// Execute command when an item from the dropdown is selected.
			this.listenTo(dropdown, 'execute', (evt) => {
				editor.execute(evt.source.commandName, { value: evt.source.commandParam });
				editor.editing.view.focus();
			});

			return dropdown;
		});
	}

	_getLocalizedOptions() {
		const editor = this.editor;
		const localizedTitles = {
			Default: '默认间距',
		};

		const configs = editor.config.get(ATTRIBUTE + '.options').filter((option) => isSupported(option));
		let unit = editor.config.get(ATTRIBUTE + '.unit') || 'px';

		if (!configs.includes('Default')) {
			configs.unshift('Default');
		}
		if (unit && unit !== 'px' && unit !== '%') {
			unit = 'px';
		}

		return normalizeOptions(configs, unit, 'margin-top').map((option) => {
			const title = localizedTitles[option.title];
			return title && title !== option.title ? Object.assign({}, option, { title }) : option;
		});
	}

	_prepareListOptions(options, command) {
		const itemDefinitions = new Collection();

		for (const option of options) {
			const def = {
				type: 'button',
				model: new Model({
					commandName: ATTRIBUTE,
					commandParam: option.model,
					label: option.title,
					class: 'ck-paragraph-spacing-dropdown-item',
					withText: true,
				}),
			};

			if (option.view && option.view.classes) {
				def.model.set('class', `${def.model.class} ${option.view.classes}`);
			}

			def.model.bind('isOn').to(command, 'value', (value) => {
				const newValue = value ? parseFloat(value) : value;
				return (value === 'Default' && option.model === undefined) || newValue === option.model;
			});

			// Add the option to the collection.
			itemDefinitions.add(def);
		}

		return itemDefinitions;
	}
}
