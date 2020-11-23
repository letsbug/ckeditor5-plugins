/**
 * @module convert-full-half/ui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { ATTRIBUTE } from './index';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import HalfIcon from '../../theme/icons/full-to-half.svg';
import FullIcon from '../../theme/icons/half-to-full.svg';

// eslint-disable-next-line no-undef
const icons = new Map([
	['full', HalfIcon],
	['half', FullIcon],
]);

// eslint-disable-next-line no-undef
const labels = new Map([
	['full', '全角转半角'],
	['half', '半角转全角'],
]);

export default class ConvertFullHalfUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ConvertFullHalfUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		editor.ui.componentFactory.add(ATTRIBUTE, (local) => {
			const command = editor.commands.get(ATTRIBUTE);
			const button = new ButtonView(local);

			button.set({
				tooltip: true,
			});

			button.bind('isEnabled').to(command);
			button.bind('icon').to(command, 'value', (val) => (val ? icons.get(val) : HalfIcon));
			button.bind('label').to(command, 'value', (val) => (val ? labels.get(val) : '全角/半角转换'));

			this.listenTo(button, 'execute', () => {
				editor.execute(ATTRIBUTE);
				editor.editing.view.focus();
			});

			return button;
		});
	}
}
