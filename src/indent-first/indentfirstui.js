/**
 * @module indent-first/indentfirstui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import alignRightIcon from './icons/action-indent2em.svg';

export default class IndentFirstUi extends Plugin {
	/**
   * @inheritDoc
   */
	static get pluginName() {
		return 'IndentFirstUI';
	}

	/**
   * @inheritDoc
   */
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add( 'indent-first', locale => {
			const command = editor.commands.get( 'indent-first' );
			const buttonView = new ButtonView( locale );

			buttonView.set( {
				label: '首行缩进',
				icon: alignRightIcon,
				tooltip: true,
				isToggleable: true
			} );

			buttonView.bind( 'isOn', 'isEnabled' ).to( command, 'value', 'isEnabled' );

			// Execute command.
			this.listenTo( buttonView, 'execute', () => {
				editor.execute( 'indent-first' );
				editor.editing.view.focus();
			} );

			return buttonView;
		} );
	}
}
