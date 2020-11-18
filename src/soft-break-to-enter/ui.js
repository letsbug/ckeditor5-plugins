/**
 * @module soft-break-to-enter/ui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { ATTRIBUTE } from './index';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import buttonIcon from '../../theme/icons/soft-break-to-enter.svg';

export default class SoftBreakToEnterUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SoftBreakToEnterUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add(ATTRIBUTE, (locale) => {
			const button = new ButtonView(locale);
			const command = editor.commands.get(ATTRIBUTE);

			button.set({
				label: '换行转断行（SHIFT+ENTER -> ENTER | <br> -> <p>）',
				icon: buttonIcon,
				tooltip: true,
			});

			button.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			this.listenTo(button, 'execute', () => {
				editor.execute(ATTRIBUTE);
				editor.editing.view.focus();
			});

			return button;
		});
	}
}
