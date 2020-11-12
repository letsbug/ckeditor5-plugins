/**
 * @module clear-empty/clearemptyui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import clearEmptyIcon from '../../theme/icons/clear-empty.svg';

export default class ClearEmptyUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearEmptyUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('clearEmpty', (locale) => {
			const command = editor.commands.get('clearEmpty');
			const buttonView = new ButtonView(locale);

			// TODO 清除空格包含首位全部空格+正文中多余1位的空格？
			buttonView.set({
				// label: '清除多余空格和空行',
				label: '清除空行（无可避免会清除有意的断行）',
				icon: clearEmptyIcon,
				tooltip: true,
			});

			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			this.listenTo(buttonView, 'execute', () => {
				editor.execute('clearEmpty');
				editor.editing.view.focus();
			});

			return buttonView;
		});
	}
}
