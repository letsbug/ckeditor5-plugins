/**
 * @module indent-first/command
 */
import { Command } from '@ckeditor/ckeditor5-core';

export class OutlineCommand extends Command {
	constructor(editor) {
		super(editor);
		this.attributeKey = 'outline';
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const doc = model.document;

		this.value = this._getValueFromFirstAllowedNode();
		this.isEnabled = model.schema.checkAttributeInSelection(doc.selection, this.attributeKey);
	}

	execute() {
		const model = this.editor.model;
		const doc = model.document;
		const selection = doc.selection;
		const value = this.value;

		model.change((writer) => {
			if (selection.isCollapsed) {
				if (!value) {
					writer.setSelectionAttribute(this.attributeKey, true);
				} else {
					writer.removeSelectionAttribute(this.attributeKey);
				}
			} else {
				const ranges = model.schema.getValidRanges(selection.getRanges(), this.attributeKey);

				for (const range of ranges) {
					if (!value) {
						writer.setAttribute(this.attributeKey, value, range);
					} else {
						writer.removeAttribute(this.attributeKey, range);
					}
				}
			}
		});
	}

	/**
	 * Checks the attribute value of the first node in the selection that allows the attribute.
	 * For the collapsed selection returns the selection attribute.
	 *
	 * @private
	 * @returns {Boolean} The attribute value.
	 */
	_getValueFromFirstAllowedNode() {
		const model = this.editor.model;
		const schema = model.schema;
		const selection = model.document.selection;

		if (selection.isCollapsed) {
			return selection.hasAttribute(this.attributeKey);
		}

		for (const range of selection.getRanges()) {
			for (const item of range.getItems()) {
				if (schema.checkAttribute(item, this.attributeKey)) {
					return item.hasAttribute(this.attributeKey);
				}
			}
		}

		return false;
	}
}
