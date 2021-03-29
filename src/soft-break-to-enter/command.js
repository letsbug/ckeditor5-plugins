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
			for (const v of model.document.selection.getSelectedBlocks()) {
				this._softBreakToEnter(writer, v);
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

	/**
	 * execute 'soft break to enter' command
	 * @param writer
	 * @param block
	 */
	_softBreakToEnter(writer, block) {
		const childes = Array.from(block.getChildren());
		if (!childes.length) {
			return;
		}

		const breaks = childes.filter((child) => child.name === 'softBreak');
		if (!breaks.length) {
			return;
		}

		if (breaks.length === 1) {
			writer.remove(breaks[0]);
			return;
		}

		let replace = this._reset(writer, block);
		let lastInsert = null;

		childes.forEach((child, i) => {
			const attrs = Object.fromEntries(child.getAttributes());

			if (child.is('$text')) {
				writer.appendText(child.data, attrs, replace);
			} else if (child.name !== 'softBreak') {
				writer.appendElement(child.name, attrs, replace);
			}

			if (child.name === 'softBreak' || i === childes.length - 1) {
				writer.insert(replace, writer.createPositionAfter(lastInsert || block));

				if (i < childes.length - 1 && child.name === 'softBreak') {
					lastInsert = replace;
					replace = this._reset(writer, block);
				}
			}
		});

		writer.remove(block);
	}
}
