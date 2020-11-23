/**
 * @module quick-style/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { STORAGE_KEY } from './index';

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
			/*clearLinks, convertFullHalf,*/ clearEmpty,
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

		editor.execute('selectAll');
		this._setStorage(options);
	}

	_setStorage(fields) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(fields));
	}
}
