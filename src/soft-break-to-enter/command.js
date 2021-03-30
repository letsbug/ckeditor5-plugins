/**
 * @module soft-break-to-enter/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';
import { findFirst } from '../utils';

export default class SoftBreakToEnterCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		this.isEnabled = this._executable(this.editor.model.document.selection.getSelectedBlocks());
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		const model = this.editor.model;

		model.change((writer) => {
			for (const block of model.document.selection.getSelectedBlocks()) {
				const childes = Array.from(block.getChildren());
				if (childes.length < 2) {
					continue;
				}

				const replaces = [];
				let replace = this._reset(writer, block);

				childes.forEach((child, i) => {
					const attrs = Object.fromEntries(child.getAttributes());

					if (child.is('$text')) {
						writer.appendText(child.data, attrs, replace);
					} else if (child.name !== 'softBreak') {
						writer.appendElement(child.name, attrs, replace);
					}

					if (child.name === 'softBreak' || i === childes.length - 1) {
						replaces.push(replace);

						if (i < childes.length - 1) {
							replace = this._reset(writer, block);
						}
					}
				});

				replaces.forEach((r, i) => {
					if (i === 0) {
						model.insertContent(r, writer.createRangeOn(block));
					} else {
						model.insertContent(r, writer.createPositionAfter(replaces[i - 1]));
					}
				});
			}
		});
	}

	_executable(iterator) {
		const first = findFirst(iterator, (block) => findFirst(block.getChildren(), (node) => node.name === 'softBreak'));
		return !!first;
	}

	/**
	 * reset replace element
	 *
	 * @param writer
	 * @param block
	 * @returns {module:engine/view/element~Element|module:engine/model/element~Element|HTMLElement|*|ActiveX.IXMLDOMElement}
	 */
	_reset(writer, block) {
		return writer.createElement(block.name, Object.fromEntries(block.getAttributes()));
	}
}
