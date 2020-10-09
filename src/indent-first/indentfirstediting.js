/**
 * @module indent-first/indentfirstediting
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import IndentFirstCommand from './indentfirstcommand';

export default class IndentFirstEditing extends Plugin {
	/**
   * @inheritDoc
   */
	static get pluginName() {
		return 'IndentFirstEditing';
	}

	/**
   * @inheritDoc
   */
	constructor( editor ) {
		super( editor );

		editor.config.define( 'indentValue', '2em' );
	}

	/**
   * @inheritDoc
   */
	init() {
		const editor = this.editor;
		const schema = editor.model.schema;

		const indentValue = editor.config.get( 'indentValue' );

		// Allow indent-first attribute on all blocks.
		schema.extend( '$block', { allowAttributes: 'indent-first' } );
		editor.model.schema.setAttributeProperties( 'indent-first', { isFormatting: true } );

		const definition = {
			model: {
				key: 'indent-first',
				values: [ 'indent-first' ]
			},
			view: {
				'indent-first': {
					key: 'style',
					value: {
						'indent-first': indentValue
						// , width: '50%'
						// , margin: '5px'
					}
				}
			}
		};

		editor.conversion.attributeToAttribute( definition );

		editor.commands.add( 'indent-first', new IndentFirstCommand( editor ) );
	}
}
