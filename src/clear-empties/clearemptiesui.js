/**
 * @module clear-empties/clearemptiesui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import clearEmptiesIcon from '../../theme/icons/clear-empties.svg';

export default class ClearEmptiesUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearEmptiesUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('clearEmpties', (locale) => {
			const command = editor.commands.get('clearEmpties');
			const buttonView = new ButtonView(locale);

			// TODO 清除空格包含首位全部空格+正文中多余1位的空格？
			buttonView.set({
				// label: '清除多余空格和空行',
				label: '清除空行（无可避免会清除有意的断行）',
				icon: clearEmptiesIcon,
				tooltip: true,
			});

			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			this.listenTo(buttonView, 'execute', () => {
				editor.execute('clearEmpties');
				editor.editing.view.focus();
			});

			return buttonView;
		});
	}
}
