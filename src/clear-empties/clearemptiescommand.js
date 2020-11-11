/**
 * @module clear-empties/clearemptiescommand
 */
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class ClearEmptiesCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		const blocks = this.editor.model.document.selection.getSelectedBlocks();
		this.isEnabled = !!blocks && this._canBeClear(Array.from(blocks));
	}

	/**
	 * @inheritDoc
	 */
	execute(/*options = {}*/) {
		const model = this.editor.model;
		const doc = model.document;

		model.change((writer) => {
			this._clearEmpties(
				writer,
				Array.from(doc.selection.getSelectedBlocks()).filter((b) => b.isEmpty)
			);
			this._clearSpaces(writer, Array.from(doc.selection.getSelectedBlocks()));
		});
	}

	_canBeClear(blocks) {
		return blocks.some((b) => b.isEmpty);
	}

	_clearEmpties(writer, blocks) {
		blocks.forEach((b) => writer.remove(b));
	}

	_clearSpaces(writer, blocks) {
		console.log(blocks);
	}
}
