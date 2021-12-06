import { Plugin } from '@ckeditor/ckeditor5-core';
import { ButtonView } from '@ckeditor/ckeditor5-ui';

import outlineIcon from '../../theme/icons/outline.svg';

const OUTLINE = 'outline';

export class OutlineUi extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'OutlineUi';
	}

	init() {
		const editor = this.editor;

		editor.ui.componentFactory.add(OUTLINE, (locale) => {
			const command = editor.commands.get(OUTLINE);
			const view = new ButtonView(locale);

			view.set({
				label: '轮廓线',
				icon: outlineIcon,
				keystroke: 'CTRL+SHIFT+O',
				tooltip: true,
				isToggleable: true,
			});

			view.bind('isOn', 'isEnabled').to(command, 'value', 'isEnabled');

			this.listenTo(view, 'execute', () => {
				editor.execute(OUTLINE);
				editor.editing.view.focus();
			});

			return view;
		});
	}
}
