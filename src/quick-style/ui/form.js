import View from '@ckeditor/ckeditor5-ui/src/view';
import FocusTracker from '@ckeditor/ckeditor5-utils/src/focustracker';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import SwitchButtonView from '@ckeditor/ckeditor5-ui/src/button/switchbuttonview';
import submitHandler from '@ckeditor/ckeditor5-ui/src/bindings/submithandler';

import KeystrokeHandler from '@ckeditor/ckeditor5-utils/src/keystrokehandler';
import ViewCollection from '@ckeditor/ckeditor5-ui/src/viewcollection';
import FocusCycler from '@ckeditor/ckeditor5-ui/src/focuscycler';

import checkIcon from '@ckeditor/ckeditor5-core/theme/icons/check.svg';
import cancelIcon from '@ckeditor/ckeditor5-core/theme/icons/cancel.svg';

import '../../../theme/quick-style-form.css';
import '@ckeditor/ckeditor5-ui/theme/components/responsive-form/responsiveform.css';

/**
 * The quick style form view controller class.
 *
 * @extends {View}
 */
export default class QuickStyleForm extends View {
	constructor(local) {
		super(local);

		/**
		 * Tracks information about DOM focus in the form.
		 *
		 * @readonly
		 * @member {FocusTracker}
		 */
		this.focusTracker = new FocusTracker();

		/**
		 * An instance of the {@link module:utils/keystrokehandler~KeystrokeHandler}.
		 *
		 * @readonly
		 * @member {KeystrokeHandler}
		 */
		this.keystrokes = new KeystrokeHandler();

		/**
		 * The value of quickStyle form values
		 *
		 * @member {Boolean} #quickStyle
		 * @observable
		 */
		this.set('quickStyleFormValue', {
			indentFirst: false,
			clearEmpty: false,
			clearSpace: false,
			softBreakToEnter: false,
		});

		/**
		 * The indentFirst field switch button view
		 *
		 * @member {SwitchButtonView}
		 */
		this.indentFirstView = this._createSwitches('首行缩进', 'indentFirst');

		/**
		 * The clearEmpty field switch button view
		 *
		 * @member {SwitchButtonView}
		 */
		this.clearEmptyView = this._createSwitches('清除空行', 'clearEmpty');

		/**
		 * The clearSpace field switch button view
		 *
		 * @member {SwitchButtonView}
		 */
		this.clearSpaceView = this._createSwitches('清除多余空格', 'clearSpace');

		/**
		 * The softBreakToEnter field switch button view
		 *
		 * @member {SwitchButtonView}
		 */
		this.softBreakToEnterView = this._createSwitches('换行转断行', 'softBreakToEnter');

		/**
		 * The Save button view.
		 *
		 * @member {ButtonView}
		 */
		this.saveButtonView = this._createButton('保存', checkIcon, 'ck-button-save', null);
		this.saveButtonView.type = 'submit';
		this.saveButtonView.bind('isEnabled').to(this, 'quickStyleFormValue', (val) => !!val);

		/**
		 * The Cancel button view.
		 *
		 * @member {ButtonView}
		 */
		this.cancelButtonView = this._createButton('取消', cancelIcon, 'ck-button-cancel', 'cancel');

		/**
		 * A collection of views that can be focused in the form.
		 *
		 * @readonly
		 * @protected
		 * @member {ViewCollection}
		 * @private
		 */
		this._focusables = new ViewCollection();

		/**
		 * Helps cycling over {@link #_focusables} in the form.
		 *
		 * @readonly
		 * @protected
		 * @member {FocusCycler}
		 * @private
		 */
		this._focusCycler = new FocusCycler({
			focusables: this._focusables,
			focusTracker: this.focusTracker,
			keystrokeHandler: this.keystrokes,
			actions: {
				focusPrevious: 'shift + tab',
				focusNext: 'tab',
			},
		});

		const actions = new View(local);
		actions.setTemplate({
			tag: 'div',

			attributes: {
				class: ['ck', 'ck-quick-style-actions'],
			},

			children: [this.saveButtonView, this.cancelButtonView],
		});

		this.setTemplate({
			tag: 'form',

			attributes: {
				class: ['ck', 'ck-quick-style-form', 'ck-form-vertical', 'ck-responsive-form'],

				tabindex: '-1',
			},

			children: [this.indentFirstView, this.clearEmptyView, this.clearSpaceView, this.softBreakToEnterView, actions],
		});
	}

	/**
	 * @inheritDoc
	 */
	render() {
		super.render();

		submitHandler({
			view: this,
		});

		const childViews = [this.indentFirstView, this.clearEmptyView, this.clearSpaceView, this.softBreakToEnterView, this.saveButtonView, this.cancelButtonView];
		childViews.forEach((v) => {
			// Register the view as focusable.
			this._focusables.add(v);

			// Register the view in the focus tracker.
			this.focusTracker.add(v.element);
		});

		// Start listening for the keystrokes coming from #element.
		this.keystrokes.listenTo(this.element);
	}

	/**
	 * Focuses the fist {@link #_focusables} in the form.
	 */
	focus() {
		this._focusCycler.focusFirst();
	}

	isValid() {
		return Object.values(this.quickStyleFormValue).some((val) => !!val);
	}

	resetFormStatus() {
		this.indentFirstView.isOn = false;
		this.clearEmptyView.isOn = false;
		this.clearSpaceView.isOn = false;
		this.softBreakToEnterView.isOn = false;

		this.quickStyleFormValue = {
			indentFirst: false,
			clearEmpty: false,
			clearSpace: false,
			softBreakToEnter: false,
		};
	}

	_createSwitches(label, name) {
		const switchButton = new SwitchButtonView(this.locale);

		switchButton.set({
			name,
			label,
			withText: true,
		});

		switchButton.on('execute', () => {
			switchButton.isOn = !switchButton.isOn;
			this.quickStyleFormValue[name] = switchButton.isOn;
		});

		return switchButton;
	}

	/**
	 * Creates a button view
	 *
	 * @param label {String}
	 * @param icon {String}
	 * @param className {String}
	 * @param eventName {String|null|undefined}
	 * @returns {ButtonView}
	 * @private
	 */
	_createButton(label, icon, className, eventName) {
		const button = new ButtonView(this.locale);

		button.set({
			label,
			icon,
			tooltip: true,
		});

		button.extendTemplate({
			attributes: {
				class: className,
			},
		});

		if (eventName) {
			button.delegate('execute').to(this, eventName);
		}

		return button;
	}
}
