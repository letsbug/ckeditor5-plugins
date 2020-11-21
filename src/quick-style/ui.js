/**
 * @module quick-style/ui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import QuickStyleForm from './ui/form';
import { ATTRIBUTE } from './index';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import Icon from '../../theme/icons/magic-wand.svg';

export default class QuickStyleUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'QuickStyleUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const command = editor.commands.get(ATTRIBUTE);

		editor.ui.componentFactory.add(ATTRIBUTE, (locale) => {
			const dropdown = createDropdown(locale);
			const quickStyleForm = new QuickStyleForm(locale);

			this._setupDropdown(dropdown, quickStyleForm, command);
			this._setupForm(dropdown, quickStyleForm);

			return dropdown;
		});
	}

	_setupDropdown(dropdown, form, command) {
		const editor = this.editor;
		const button = dropdown.buttonView;

		dropdown.bind('isEnabled').to(command);
		dropdown.panelView.children.add(form);

		button.set({
			label: '快速排版',
			icon: Icon,
			tooltip: true,
		});

		button.on('open', () => {
			//
		});

		dropdown.extendTemplate({
			attributes: {
				class: ['ck-quick-style-dropdown'],
			},
		});

		dropdown.on('submit', () => {
			if (!form.isValid()) {
				return;
			}

			console.log('quick style command logic to be perfect');
			closeDropdown();
		});

		dropdown.on('change:isOpen', () => form.resetFormStatus());
		dropdown.on('cancel', () => closeDropdown());

		function closeDropdown() {
			editor.editing.view.focus();
			dropdown.isOpen = false;
		}
	}

	_setupForm(dropdown, form /*, command*/) {
		form.delegate('submit', 'cancel').to(dropdown);
	}
}
