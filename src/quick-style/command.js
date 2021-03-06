/**
 * @module quick-style/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class QuickStyleCommand extends Command {
	// /**
	//  * @inheritDoc
	//  */
	// refresh() {
	// 	this.isEnabled = true;
	// }

	/**
	 * @inheritDoc
	 */
	execute(options = {}) {
		const editor = this.editor;

		const {
			textFormat,
			indentFirst,
			/*clearLinks,*/
			convertHalfFull,
			clearEmpty,
			clearSpace,
			softBreakToEnter,
		} = options;

		if (textFormat) {
			editor.execute('selectAll');
			editor.execute('removeFormat');
		}

		if (softBreakToEnter) {
			editor.execute('selectAll');
			editor.execute('softBreakToEnter');
		}

		if (clearEmpty) {
			editor.execute('selectAll');
			editor.execute('clearEmpty');
		}

		if (clearSpace) {
			editor.execute('selectAll');
			editor.execute('clearSpace');
		}

		if (indentFirst) {
			editor.execute('selectAll');
			editor.execute('indentFirst');
		}

		if (convertHalfFull) {
			editor.execute('selectAll');
			editor.execute('convertFullHalf', { type: 'half' });
		}

		editor.execute('selectAll');
	}
}
