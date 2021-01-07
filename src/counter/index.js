/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module counter/index
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { modelElementToPlainText } from './utils';
import { isElement, throttle } from 'lodash-es';
import View from '@ckeditor/ckeditor5-ui/src/view';
import Template from '@ckeditor/ckeditor5-ui/src/template';

/**
 * The word count plugin.
 *
 * This plugin calculates all words and characters in all {@link module:engine/model/text~Text text nodes} available in the model.
 * It also provides an HTML element that updates its state whenever the editor content is changed.
 *
 * The model's data is first converted to plain text using {@link module:word-count/utils~modelElementToPlainText}.
 * The number of words and characters in your text are determined based on the created plain text. Please keep in mind
 * that every block in the editor is separated with a newline character, which is included in the calculation.
 *
 * Here are some examples of how the word and character calculations are made:
 *
 * 		<paragraph>foo</paragraph>
 * 		<paragraph>bar</paragraph>
 * 		// Words: 2, Characters: 7
 *
 * 		<paragraph><$text bold="true">foo</$text>bar</paragraph>
 * 		// Words: 1, Characters: 6
 *
 * 		<paragraph>*&^%)</paragraph>
 * 		// Words: 0, Characters: 5
 *
 * 		<paragraph>foo(bar)</paragraph>
 * 		//Words: 2, Characters: 8
 *
 * 		<paragraph>12345</paragraph>
 * 		// Words: 1, Characters: 5
 *
 * @extends module:core/plugin~Plugin
 */
export default class Counter extends Plugin {
	/**
	 * @inheritDoc
	 */
	constructor(editor) {
		super(editor);

		/**
		 * The number of characters in the editor.
		 *
		 * @observable
		 * @readonly
		 * @member {Number} module:counter/index~Counter#characters
		 */
		this.set('characters', 0);

		/**
		 * The number of double byte characters in the editor.
		 * @observable
		 * @readonly
		 * @member {Number} module:counter/index~Counter#doubles
		 */
		this.set('doubles', 0);

		// Don't wait for the #update event to set the value of the properties but obtain it right away.
		// This way, accessing the properties directly returns precise numbers, e.g. for validation, etc.
		// If not accessed directly, the properties will be refreshed upon #update anyway.
		Object.defineProperties(this, {
			characters: {
				get() {
					return (this.characters = this._getCharacters().length);
				},
			},
			doubles: {
				get() {
					return (this.doubles = this._getDoubles());
				},
			},
		});

		/**
		 * The label used to display the characters value in the {@link #CounterContainer output container}.
		 *
		 * @observable
		 * @private
		 * @readonly
		 * @member {String} module:counter/index~Counter#_charactersLabel
		 */
		this.set('_charactersLabel');

		/**
		 * The label used to display the double bytes characters value in the {@link #CounterContainer output container}
		 *
		 * @observable
		 * @private
		 * @readonly
		 * @member {String} module:counter/index~Counter#_doublesLabel
		 */
		this.set('_doublesLabel');

		/**
		 * The configuration of this plugin.
		 *
		 * @private
		 * @type {Object}
		 */
		this._config = editor.config.get('counter') || {};

		/**
		 * The reference to a {@link module:ui/view~View view object} that contains the self-updating HTML container.
		 *
		 * @private
		 * @readonly
		 * @type {module:ui/view~View}
		 */
		this._outputView = undefined;
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'Counter';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		editor.model.document.on('change:data', throttle(this._refreshStats.bind(this), 250));

		if (typeof this._config.onUpdate == 'function') {
			this.on('update', (evt, data) => {
				this._config.onUpdate(data);
			});
		}

		if (isElement(this._config.container)) {
			this._config.container.appendChild(this.CounterContainer);
		}
	}

	/**
	 * @inheritDoc
	 */
	destroy() {
		if (this._outputView) {
			this._outputView.element.remove();
			this._outputView.destroy();
		}

		super.destroy();
	}

	/**
	 * Creates a self-updating HTML element. Repeated executions return the same element.
	 * The returned element has the following HTML structure:
	 *
	 * 		<div class="ck ck-word-count">
	 * 			<div class="ck-word-count__words">Words: 4</div>
	 * 			<div class="ck-word-count__characters">Characters: 28</div>
	 * 		</div>
	 *
	 * @type {HTMLElement}
	 */
	get CounterContainer() {
		const editor = this.editor;
		const displayCharacters = editor.config.get('counter.characters');
		const displayDoubles = editor.config.get('counter.doubles');
		const bind = Template.bind(this, this);
		const children = [];

		if (!this._outputView) {
			this._outputView = new View();

			if (displayCharacters || displayCharacters === undefined) {
				this.bind('_charactersLabel').to(this, 'characters', (words) => {
					return `字符数: ${words}`;
				});

				children.push({
					tag: 'div',
					children: [
						{
							text: [bind.to('_charactersLabel')],
						},
					],
					attributes: {
						class: 'ck-counter__characters',
					},
				});
			}

			if (displayDoubles || displayDoubles === undefined) {
				this.bind('_doublesLabel').to(this, 'doubles', (words) => {
					return `双字节字符数: ${words}`;
				});

				children.push({
					tag: 'div',
					children: [
						{
							text: [bind.to('_doublesLabel')],
						},
					],
					attributes: {
						class: 'ck-counter__doubles',
					},
				});
			}

			this._outputView.setTemplate({
				tag: 'div',
				attributes: {
					class: ['ck', 'ck-counter'],
				},
				children,
			});

			this._outputView.render();
		}

		return this._outputView.element;
	}

	/**
	 * Determines the plain text in the current editor's model.
	 *
	 * @private
	 * @return {String}
	 */
	_getPlains() {
		return modelElementToPlainText(this.editor.model.document.getRoot());
	}

	/**
	 * Determines the number of characters in the current editor's model.
	 *
	 * @private
	 * @returns {String}
	 */
	_getCharacters() {
		return this._getPlains().replace(/\n/g, '');
	}

	/**
	 * Determines the number of double bytes characters in the current editor's model
	 *
	 * @private
	 * @return {Number}
	 */
	_getDoubles() {
		const plains = this._getCharacters();
		// eslint-disable-next-line no-control-regex
		const reg = new RegExp('[^\x00-\xff]', 'g');
		const res = plains.match(reg);
		return plains.length + (res ? res.length : 0);
	}

	/**
	 * Determines the number of words and characters in the current editor's model and assigns it to {@link #characters} and {@link #words}.
	 * It also fires the {@link #event:update}.
	 *
	 * @private
	 * @fires update
	 */
	_refreshStats() {
		const characters = (this.characters = this._getCharacters().length);
		const doubles = (this.doubles = this._getDoubles());

		this.fire('update', {
			characters,
			doubles,
		});
	}
}

/**
 * An event fired after {@link #words} and {@link #characters} are updated.
 *
 * @event update
 * @param {Object} data
 * @param {Number} data.words The number of words in the current model.
 * @param {Number} data.characters The number of characters in the current model.
 */

/**
 * The configuration of the counter feature.
 *
 *		ClassicEditor
 *			.create( {
 *				wordCount: ... // Word count feature configuration.
 *			} )
 *			.then( ... )
 *			.catch( ... );
 *
 * See {@link module:core/editor/editorconfig~EditorConfig all editor options}.
 *
 * @interface module:counter/index~WordCountConfig
 */

/**
 * The configuration of the counter feature.
 * It is introduced by the {@link module:counter/index~Counter} feature.
 *
 * Read more in {@link module:counter/index~WordCountConfig}.
 *
 * @member {module:counter/index~WordCountConfig} module:core/editor/editorconfig~EditorConfig#wordCount
 */

/**
 * This option allows for hiding the character counter. The element obtained through
 * {@link module:counter/index~Counter#CounterContainer} will only preserve
 * the words part. Character counter is displayed by default when this configuration option is not defined.
 *
 *		const CounterConfig = {
 *			characters: false
 *		};
 *
 * The configuration above will result in the following container:
 *
 *		<div class="ck ck-counter">
 *			<div class="ck-counter__characters">Characters: 4</div>
 *		</div>
 *
 * @member {Boolean} module:counter/index~WordCountConfig#displayCharacters
 */

/**
 * This configuration takes a function that is executed whenever the word count plugin updates its values.
 * This function is called with one argument, which is an object with the `words` and `characters` keys containing
 * the number of detected words and characters in the document.
 *
 *		const counterConfig = {
 *			onUpdate: function( stats ) {
 *				doSthWithCharacterNumber( stats.characters );
 *				doSthWithDoubleNumber( stats.doubles );
 *			}
 *		};
 *
 * @member {Function} module:counter/index~CounterConfig#onUpdate
 */

/**
 * Allows for providing the HTML element that the
 * {@link module:counter/index~Counter#CounterContainer counter container} will be appended to automatically.
 *
 *		const counterConfig = {
 *			container: document.getElementById( 'container-for-counter' );
 *		};
 *
 * @member {HTMLElement} module:counter/index~CounterConfig#container
 */
