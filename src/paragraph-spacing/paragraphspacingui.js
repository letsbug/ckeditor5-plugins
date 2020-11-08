/**
 * @module indent-first/paragraphspacingui
 */
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';
import paragraphSpacingIcon from '../../theme/icons/paragraph-spacing.svg';

export default class ParagraphSpacingUI extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ParagraphSpacingUI';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const editor = this.editor;
		const command = editor.commands.get('paragraphSpacing');

		editor.ui.componentFactory.add('paragraphSpacing', (locale) => {
			const dropdown = createDropdown(locale);

			dropdown.buttonView.set({
				label: '段落间距',
				icon: paragraphSpacingIcon,
				tooltip: true,
			});

			dropdown.extendTemplate({
				attributes: {
					class: ['ckeditor5-paragraph-spacing-dropdown'],
				},
			});

			dropdown.bind('isEnabled').to(command);

			// Execute command when an item from the dropdown is selected.
			this.listenTo(dropdown, 'execute', (evt) => {
				editor.execute(evt.source.commandName, { value: evt.source.commandParam });
				editor.editing.view.focus();
			});

			return dropdown;
		});
	}
}
