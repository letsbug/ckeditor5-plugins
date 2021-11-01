import { Plugin } from '@ckeditor/ckeditor5-core';
import { HighlightSpecificState } from './state';
import { HighlightSpecificCommand } from './command';

import '../../theme/highlight-specific.css';

export class HighlightSpecificEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'HighlightSpecificEditing';
	}

	constructor(editor) {
		super(editor);

		// TODO complete this, user custom colors.
		editor.config.define('highlightSpecific', {
			red: 'var(--ck-highlight-pen-red)',
			yellow: 'var(--ck-highlight-marker-yellow)',
		});
	}

	init() {
		const config = this.editor.config.get('highlightSpecific');

		this.state = new HighlightSpecificState(this.editor.model, config);

		this._defineConverters();
		this._defineCommands();

		// this.listenTo(this.state, 'change:data')
	}

	_defineCommands() {
		const editor = this.editor;
		editor.commands.add('highlightSpecific', new HighlightSpecificCommand(editor, this.state));
	}

	_defineConverters() {
		const editor = this.editor;

		editor.conversion.for('editingDowncast').markerToHighlight({
			model: 'highlightSpecific',
			view: ({ markerName }) => {
				// highlightSpecific:{color}:{id}
				const [, color, id] = markerName.split(':');
				return {
					name: 'span',
					classes: ['ck-highlight-specific', color],
					attributes: {
						'data-highlight-specific': id,
					},
				};
			},
		});
	}
}
