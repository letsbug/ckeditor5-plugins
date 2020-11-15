/**
 * @module clear-space/clearspaceui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import trimIcon from '../../theme/icons/trim.svg';

export default class ClearSpaceUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ClearSpaceUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add('clearSpace', (locale) => {
			const command = editor.commands.get('clearSpace');
			const buttonView = new ButtonView(locale);

			// TODO 清除空格包含首位全部空格+正文中多余1位的空格？
			buttonView.set({
				// label: '清除多余空格和空行',
				label: '清除多余空格（无可避免会清除有意的空格）',
				icon: trimIcon,
				tooltip: true,
			});

			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			this.listenTo(buttonView, 'execute', () => {
				editor.execute('clearSpace');
				editor.editing.view.focus();
			});

			return buttonView;
		});
	}
}
