/**
 * @module find-replace/ui
 */
import { Plugin } from '@ckeditor/ckeditor5-core';
import { KeystrokeHandler, FocusTracker } from '@ckeditor/ckeditor5-utils';
import {
	ButtonView,
	LabeledFieldView,
	ViewCollection,
	FocusCycler,
	createDropdown,
	addToolbarToDropdown,
	createLabeledInputText,
} from '@ckeditor/ckeditor5-ui';
import { ATTRIBUTE, CURRENT_MARKER, SEARCH_MARKER } from './index';
import searchIcon from '../../theme/icons/find-replace.svg';

export class FindReplaceUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FindReplaceUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		// conversion between model and view
		editor.conversion
			.for('downcast')
			.markerToHighlight({ model: SEARCH_MARKER, view: () => ({ classes: 'search-item' }) });
		editor.conversion
			.for('downcast')
			.markerToHighlight({ model: CURRENT_MARKER, view: () => ({ classes: 'current', priority: 99 }) });

		// Setup `findReplace` plugin button.
		editor.ui.componentFactory.add('findReplace', (locale) => {
			const dropdown = createDropdown(locale);
			this.findInput = new LabeledFieldView(this.locale, createLabeledInputText);
			const inputField = this.findInput.fieldView;
			inputField.placeholder = 'Enter: 下一个; Shift+Enter: 上一个';
			this.findInput.label = '查找（多个空格隔开）';

			this.replaceInput = new LabeledFieldView(this.locale, createLabeledInputText);
			const replaceField = this.replaceInput.fieldView;
			replaceField.placeholder = 'Enter: 替换; Ctrl+Enter: 替换全部';
			this.replaceInput.label = '替换';
			this._setUpDropdown(dropdown, this.findInput, this.replaceInput, editor);

			return dropdown;
		});
	}

	/**
	 * Creates a button view.
	 *
	 * @private
	 * @param {String} label The button label.
	 // * @param {String} icon The button icon.
	 // * @param {String} className The additional button CSS class name.
	 * @param {String} [eventName] An event name that the `ButtonView#execute` event will be delegated to.
	 * @returns {ButtonView} The button view instance.
	 */
	_createButton(label, eventName) {
		const button = new ButtonView(this.locale);

		button.set({
			label,
			withText: true,
			tooltip: false,
		});

		if (eventName) {
			button.delegate('execute').to(this, eventName);
		}

		return button;
	}

	_setUpDropdown(dropdown, findField, replaceField, editor) {
		const button = dropdown.buttonView;

		addToolbarToDropdown(dropdown, [findField]);
		addToolbarToDropdown(dropdown, [replaceField]);

		const keystrokes = new KeystrokeHandler();
		keystrokes.listenTo(findField.fieldView.element);
		const findItems = (data) => {
			editor.execute(ATTRIBUTE, { type: 'find', position: 'next', key: findField });
			data.preventDefault();
		};
		const findItemsBackwards = (data) => {
			editor.execute(ATTRIBUTE, { type: 'find', position: 'prev', key: findField });
			data.preventDefault();
		};
		keystrokes.set('enter', findItems, { priority: 'highest' });
		keystrokes.set('shift+enter', findItemsBackwards, { priority: 'highest' });

		const keystrokesReplace = new KeystrokeHandler();
		keystrokesReplace.listenTo(replaceField.fieldView.element);
		const replaceItems = (data) => {
			editor.execute(ATTRIBUTE, { type: 'replace', key: findField, replace: replaceField });
			// this._replace(findField, replaceField);
			data.preventDefault();
		};
		const replaceAllItems = (data) => {
			editor.execute(ATTRIBUTE, { type: 'replaceAll', key: findField, replace: replaceField });
			// this._replaceAll(findField, replaceField);
			data.preventDefault();
		};
		keystrokesReplace.set('enter', replaceItems, { priority: 'highest' });
		keystrokesReplace.set('ctrl+enter', replaceAllItems, { priority: 'highest' });

		this.replaceButton = this._createButton('替换');
		this.replaceAllButton = this._createButton('替换全部');

		this.previousButton = this._createButton('上一个');
		this.nextButton = this._createButton('下一个');

		this.listenTo(this.nextButton, 'execute', () =>
			editor.execute(ATTRIBUTE, { type: 'find', position: 'next', key: findField })
		);
		this.listenTo(this.previousButton, 'execute', () =>
			editor.execute(ATTRIBUTE, { type: 'find', position: 'prev', key: findField })
		);
		this.listenTo(this.replaceButton, 'execute', () =>
			editor.execute(ATTRIBUTE, { type: 'replace', key: findField, replace: replaceField })
		);
		this.listenTo(this.replaceAllButton, 'execute', () =>
			editor.execute(ATTRIBUTE, { type: 'replaceAll', key: findField, replace: replaceField })
		);

		const toolbarButtons = [this.previousButton, this.nextButton, this.replaceButton, this.replaceAllButton];

		addToolbarToDropdown(dropdown, toolbarButtons);

		/**
		 * Tracks information about DOM focus in the form.
		 *
		 * @readonly
		 * @member {module:utils/focustracker~FocusTracker}
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * A collection of views that can be focused in the form.
		 *
		 * @readonly
		 * @protected
		 * @member {module:ui/viewcollection~ViewCollection}
		 */
		this._focusables = new ViewCollection();

		/**
		 * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
		 *
		 * @readonly
		 * @member {module:utils/keystrokehandler~KeystrokeHandler}
		 */
		this.keystrokes = new KeystrokeHandler();

		/**
		 * Helps cycling over {@link #_focusables} in the form.
		 *
		 * @readonly
		 * @protected
		 * @member {module:ui/focuscycler~FocusCycler}
		 */
		this._focusCycler = new FocusCycler({
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				// Navigate form fields backwards using the Shift + Tab keystroke.
				focusPrevious: 'shift + tab',
				// Navigate form fields forwards using the Tab key.
				focusNext: 'tab',
			},
		});

		this._addTabSupport(findField);
		this._addTabSupport(replaceField);
		toolbarButtons.forEach((btn) => this._addTabSupport(btn));

		button.set({
			label: '查找和替换',
			icon: searchIcon,
			tooltip: true,
			keystroke: 'Ctrl+F',
		});

		editor.keystrokes.set('Ctrl+F', (keyEvtData, cancel) => {
			button.set('isOn', true);
			dropdown.set('isOpen', true);
			findField.focus();
			cancel();
		});

		// Note: Use the low priority to make sure the following listener starts working after the
		// default action of the drop-down is executed (i.e. the panel showed up). Otherwise, the
		// invisible form/input cannot be focused/selected.
		button.on('open', () => findField.focus(), { priority: 'low' });

		// prevents the dropdown of closing on execute, since the user might want to keep searching or replacing text
		dropdown.off('execute');

		// remove search markers when the search bar is closed
		dropdown.on('change:isOpen', () => {
			if (!dropdown.isOpen) {
				editor.execute(ATTRIBUTE, { type: 'reset', key: findField, replace: replaceField });
				// this._resetStatus();
				editor.editing.view.focus();
			}
		});

		dropdown.on('cancel', () => closeUI());
		function closeUI() {
			editor.editing.view.focus();
			dropdown.isOpen = false;
		}
	}

	_addTabSupport(object) {
		// Register the view as focusable.
		this._focusables.add(object);
		// Register the view in the focus tracker.
		this.focusTracker.add(object.element);
		this.keystrokes.listenTo(object.element);
	}
}
