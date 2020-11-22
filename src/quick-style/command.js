/**
 * @module quick-style/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { softBreakToEnter } from '../soft-break-to-enter/utils';
import { clearEmpty } from '../clear-empty/utils';
import { clearSpace } from '../clear-space/utils';
import { indentFirst, indentFirstExecutable } from '../indent-first/utils';

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
		const model = this.editor.model;

		model.change((writer) => {
			const { textFormat, indentFirst, clearEmpty, clearSpace, softBreakToEnter } = options;

			if (textFormat) {
				this.editor.execute('removeFormat');
			}

			if (softBreakToEnter) {
				this._softBreakToEnter(writer);
			}

			if (clearEmpty) {
				this._clearEmpty(writer);
			}

			if (clearSpace) {
				this._clearSpace(writer);
			}

			if (indentFirst) {
				this._indentFirst(writer);
			}

			this.editor.execute('selectAll');
		});
	}

	_indentFirst(writer) {
		const schema = this.editor.model.schema;
		const blocks = this._findAllElements().filter((block) => indentFirstExecutable(schema, block));
		indentFirst(writer, blocks);
	}

	_clearEmpty(writer) {
		const blocks = this._findAllElements();
		blocks.forEach((block) => {
			clearEmpty(writer, block);
		});
	}

	_clearSpace(writer) {
		const blocks = this._findAllElements();
		blocks.forEach((block) => {
			clearSpace(writer, block);
		});
	}

	_softBreakToEnter(writer) {
		const blocks = this._findAllElements();
		blocks.forEach((block) => {
			softBreakToEnter(writer, block);
		});
	}

	_findAllElements() {
		return Array.from(this.editor.model.document.getRoot().getChildren());
	}
}
