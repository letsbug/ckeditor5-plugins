/**
 * @module indent-first/indentfirstui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import indentFirst from '../../theme/icons/indent-first.svg';

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

		editor.ui.componentFactory.add('indentFirst', (locale) => {
			const command = editor.commands.get('indentFirst');
			const buttonView = new ButtonView(locale);

			buttonView.set({
				label: '首行缩进',
				icon: indentFirst,
				tooltip: true,
				isToggleable: true,
			});

			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			// Execute command.
			this.listenTo(buttonView, 'execute', () => {
				editor.execute('indentFirst');
				editor.editing.view.focus();
			});

			return buttonView;
		});
	}
}
