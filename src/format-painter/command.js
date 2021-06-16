import { Command } from '@ckeditor/ckeditor5-core';

export default class FormatPainterCommand extends Command {
	/**
	 * @inheritDoc
	 * @param editor
	 */
	constructor(editor) {
		super(editor);
		this.isEnabled = false;
		this.formatNodes = null;
		this.waiting = null;
	}

	/**
	 * @inheritDoc
	 */
	refresh() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const start = selection.getFirstPosition();
		const end = selection.getLastPosition();
		if (!start || !end || this._isNone(start, end)) {
			this.isEnabled = false;
			return;
		}

		const range = model.createRange(start, end);
		const formatNodes = Array.from(range.getWalker()).filter((walker) => !!walker.item.textNode);
		if (!formatNodes.length) {
			this._reset();
			return;
		}

		this.formatNodes = formatNodes;
		this.isEnabled = true;
	}

	/**
	 * @inheritDoc
	 *
	 * @param {Object} options
	 * @param {'copy'|'apply'|'reset'} options.type
	 */
	execute(options = { type: 'reset' }) {
		const { type } = options;
		if (type === 'reset') {
			this._reset();
			return;
		}

		if (type === 'apply' && this.waiting) {
			this._apply();
			return;
		}

		if (type === 'copy' && this.isEnabled) {
			this._copy();
		}
	}

	_isNone(start, end) {
		const [sRow, sCol] = start.path;
		const [eRow, eCol] = end.path;
		if (sRow === eRow) {
			return sCol === eCol;
		}

		return false;
	}

	_reset() {
		this.isEnabled = false;
		this.formatNodes = null;
		this.waiting = null;
	}

	_copy() {
		let attrs = {};
		this.formatNodes.forEach((node) => {
			const _attrs = Object.fromEntries(node.item.textNode.getAttributes());
			const _keys = Object.keys(_attrs);
			// eslint-disable-next-line no-prototype-builtins
			if (_attrs.hasOwnProperty('linkHref')) {
				delete _attrs.linkHref;
			}

			_keys.forEach((key) => {
				// eslint-disable-next-line no-prototype-builtins
				if (attrs.hasOwnProperty(key)) delete _attrs[key];
			});

			if (_keys.length) {
				attrs = Object.assign({}, attrs, _attrs);
			}
		});
		this.waiting = attrs;
		// TODO change copied cursor icon
	}

	_apply() {
		const model = this.editor.model;
		const selection = model.document.selection;
		const start = selection.getFirstPosition();
		const end = selection.getLastPosition();
		if (!start || !end || this._isNone(start, end)) {
			return;
		}

		const selectionRange = model.createRange(start, end);

		model.change((writer) => {
			const walkers = selectionRange.getWalker();
			for (const walker of walkers) {
				const textNode = walker.item.textNode;
				if (textNode) {
					const range = writer.createRange(walker.previousPosition, walker.nextPosition);
					this._setAttributes(writer, range);
				}
			}
		});

		this.waiting = null;
	}

	_setAttributes(writer, itemOrRange) {
		if (!Object.keys(this.waiting).length) {
			writer.clearAttributes(itemOrRange);
		}
		writer.setAttributes(this.waiting, itemOrRange);
	}
}
