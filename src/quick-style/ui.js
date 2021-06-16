/**
 * @module quick-style/ui
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { createDropdown, SplitButtonView } from '@ckeditor/ckeditor5-ui';
import { ATTRIBUTE, STORAGE_KEY } from './index';
import QuickStyleForm from './ui/form';
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
			const dropdown = createDropdown(locale, SplitButtonView);
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
		// dropdown
		// 	.bind('isEnabled')
		// 	.to(command, 'value', (val) => !!val && Object.keys(val).length && Object.values(val).length);
		dropdown.panelView.children.add(form);

		button.on('execute', () => {
			const vals = this._getStorage();
			if (!vals || Object.values(vals).every((executable) => !executable)) {
				button.fire('open');
				return;
			}
			editor.execute('quickStyle', vals);
			editor.editing.view.focus();
		});

		button.set({
			label: '快速排版',
			icon: Icon,
			tooltip: true,
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

			const vals = form.quickStyleFormValue;
			editor.execute('quickStyle', vals);
			this._setStorage(vals);
			closeDropdown();
		});

		dropdown.on('change:isOpen', () => form.resetFormStatus(this._getStorage()));
		dropdown.on('cancel', () => closeDropdown());

		function closeDropdown() {
			editor.editing.view.focus();
			dropdown.isOpen = false;
		}
	}

	_setupForm(dropdown, form /*, command*/) {
		form.delegate('submit', 'cancel').to(dropdown);
	}

	_getStorage() {
		const fields = localStorage.getItem(STORAGE_KEY);
		if (!fields) {
			return null;
		}

		try {
			return JSON.parse(fields);
		} catch {
			return null;
		}
	}

	_setStorage(fields) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
	}
}
