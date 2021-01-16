/**
 * @module find-replace/index
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import { addToolbarToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';
import LabeledFieldView from '@ckeditor/ckeditor5-ui/src/labeledfield/labeledfieldview';
import { createLabeledInputText } from '@ckeditor/ckeditor5-ui/src/labeledfield/utils';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import { scrollViewportToShowTarget } from '@ckeditor/ckeditor5-utils/src/dom/scroll';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import { getIndicesOf } from './utils';

import '../../theme/find-replace.css';
import searchIcon from '../../theme/icons/find-replace.svg';

const SEARCH_MARKER = 'SEARCH';
const CURRENT_MARKER = 'CURRENT';

export default class FindReplace extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'FindReplace';
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
			this._find(findField, 1);
			data.preventDefault();
		};
		const findItemsBackwards = (data) => {
			this._find(findField, -1);
			data.preventDefault();
		};
		keystrokes.set('enter', findItems, { priority: 'highest' });
		keystrokes.set('shift+enter', findItemsBackwards, { priority: 'highest' });

		const keystrokesReplace = new KeystrokeHandler();
		keystrokesReplace.listenTo(replaceField.fieldView.element);
		const replaceItems = (data) => {
			this._replace(findField, replaceField);
			data.preventDefault();
		};
		const replaceAllItems = (data) => {
			this._replaceAll(findField, replaceField);
			data.preventDefault();
		};
		keystrokesReplace.set('enter', replaceItems, { priority: 'highest' });
		keystrokesReplace.set('ctrl+enter', replaceAllItems, { priority: 'highest' });

		this.replaceButton = this._createButton('替换');
		this.replaceAllButton = this._createButton('替换全部');

		this.previousButton = this._createButton('上一个');
		this.nextButton = this._createButton('下一个');

		this.listenTo(this.nextButton, 'execute', () => this._find(findField, 1));
		this.listenTo(this.previousButton, 'execute', () => this._find(findField, -1));
		this.listenTo(this.replaceButton, 'execute', () => this._replace(findField, replaceField));
		this.listenTo(this.replaceAllButton, 'execute', () => this._replaceAll(findField, replaceField));

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
				this._resetStatus();
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

	_isSameSearch(values, markers) {
		const fullVal = values.join(' ');
		// eslint-disable-next-line no-undef
		const markersMerge = Array.from(new Set(markers.map((marker) => marker.name.split(':')[1]))).join(' ');
		// search:searchTerm:counter
		return fullVal === markersMerge;
	}

	_find(findField, increment) {
		const model = this.editor.model;
		const searchTerm = findField.fieldView.element.value;
		const values = searchTerm.trim().split(' ');
		// if (values.length > 1 && /(\S+) (\S+)/.test(searchTerm)) {
		// 	values.push(searchTerm);
		// }

		let markers = Array.from(model.markers.getMarkersGroup(SEARCH_MARKER));

		if (markers.length && this._isSameSearch(values, markers)) {
			// loop through the items
			this.currentSearchIndex = (this.currentSearchIndex + markers.length + increment) % markers.length;
		} else {
			this._resetStatus();
			// Create a range spanning over the entire root content:
			const range = model.createRangeIn(model.document.getRoot());
			let counter = 0;
			model.change((writer) => {
				// Iterate over all items in this range:
				for (const value of range.getWalker()) {
					const textNode = value.item.textNode;
					if (!textNode) {
						continue;
					}

					const text = value.item.data;
					for (const val of values) {
						const indices = getIndicesOf(val, text, false);
						for (const index of indices) {
							const label = SEARCH_MARKER + ':' + val + ':' + counter++;
							const startIndex = textNode.startOffset + index;
							const start = writer.createPositionAt(textNode.parent, startIndex);
							const end = writer.createPositionAt(textNode.parent, startIndex + val.length);
							writer.addMarker(label, { range: writer.createRange(start, end), usingOperation: false });
						}
					}
				}
				// update markers variable after search
				markers = Array.from(model.markers.getMarkersGroup(SEARCH_MARKER));
			});
			this.currentSearchIndex = 0;
		}
		findField.infoText = markers && ~markers.length ? `${this.currentSearchIndex + 1}/${markers.length}` : '未找到';

		const currentMarker = markers[this.currentSearchIndex];
		this._scrollTo(currentMarker);
		return currentMarker;
	}

	_scrollTo(marker) {
		const editor = this.editor;
		if (!marker) {
			return;
		}

		editor.model.change((writer) => {
			this._removeCurrentSearchMarker(writer);
			this.currentSearchMarker = writer.addMarker(CURRENT_MARKER, {
				range: marker.getRange(),
				usingOperation: false,
			});
		});
		const viewRange = editor.editing.mapper.toViewRange(marker.getRange());
		const domRange = editor.editing.view.domConverter.viewRangeToDom(viewRange);
		scrollViewportToShowTarget({ target: domRange, viewportOffset: 130 });
	}

	_resetStatus() {
		this.findInput.infoText = undefined;
		this.replaceInput.infoText = undefined;
		this.currentSearchIndex = 0;
		const model = this.editor.model;
		model.change((writer) => {
			for (const searchMarker of model.markers.getMarkersGroup(SEARCH_MARKER)) {
				writer.removeMarker(searchMarker);
			}
			this._removeCurrentSearchMarker(writer);
		});
	}

	_removeCurrentSearchMarker(writer) {
		if (this.currentSearchMarker) {
			writer.removeMarker(this.currentSearchMarker);
			this.currentSearchMarker = undefined;
		}
	}

	_replace(findField, replaceField) {
		const model = this.editor.model;
		const markers = Array.from(model.markers.getMarkersGroup(SEARCH_MARKER));
		const sameSearch = this._isSameSearch(findField, markers);
		const currentMarker = sameSearch ? markers[this.currentSearchIndex] : this._find(findField, 1);
		const replaceBy = replaceField.fieldView.element.value;
		if (currentMarker && currentMarker.getRange) {
			model.change((writer) => {
				model.insertContent(writer.createText(replaceBy), currentMarker.getRange());
				writer.removeMarker(currentMarker);
				this._removeCurrentSearchMarker(writer);
			});
			// refresh the items...
			this._find(findField, 0);
		}
	}

	_replaceAll(findField, replaceField) {
		const model = this.editor.model;
		// fires the find operation to make sure the search is loaded before replace
		this._find(findField, 1);
		const replaceBy = replaceField.fieldView.element.value;
		model.change((writer) => {
			const markers = model.markers.getMarkersGroup(SEARCH_MARKER);
			let size = 0;
			let len = markers.length;
			for (const marker of markers) {
				model.insertContent(writer.createText(replaceBy), marker.getRange());
				size++;
			}
			this._resetStatus();
			replaceField.infoText = `${size}/${len}`;
		});
	}
}
