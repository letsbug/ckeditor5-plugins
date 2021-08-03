import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';
import { ATTRIBUTE } from './index';
import BrushIcon from '../../theme/icons/brush.svg';

export class FormatPainterUI extends Plugin {
	/**
	 * @inheritDoc
	 * @return {string}
	 */
	static get pluginName() {
		return 'FormatPainterUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add(ATTRIBUTE, (locale) => {
			const command = editor.commands.get(ATTRIBUTE);
			const buttonView = new ButtonView(locale);

			buttonView.set({
				label: '复制所选区域的格式并应用于新的选择区域',
				tooltip: true,
				icon: BrushIcon,
			});

			buttonView.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			this.listenTo(buttonView, 'execute', () => {
				editor.execute(ATTRIBUTE, { type: 'copy' });
				editor.editing.view.focus();
			});

			editor.editing.view.document.on('mouseup', () => {
				editor.execute(ATTRIBUTE, { type: 'apply' });
			});

			editor.editing.view.document.on('blur', () => {
				editor.execute(ATTRIBUTE, { type: 'clear' });
			});

			return buttonView;
		});
	}
}
