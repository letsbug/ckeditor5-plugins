/**
 * A plugin that converts custom attributes for elements that are wrapped in <figure> in the view.
 *
 * @see https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/conversion/conversion-preserving-custom-content.html
 */
import { Plugin } from '@ckeditor/ckeditor5-core';

class FigureAttributes extends Plugin {
	/**
	 * @inheritDoc
	 *
	 * @param editor
	 */
	constructor(editor) {
		super(editor);

		this.options = this.editor.config.get('figureAttributes');
	}

	/**
	 * Sets the conversion up and extends the table & image features schema.
	 * <br>
	 *
	 * **Note:** `Schema extending must be done in the "afterInit()" call because plugins define their schema in "init()".`
	 */
	afterInit() {
		const plugins = this.editor.plugins;
		const { table, image } = this.options;

		if (plugins.has('Table') && this._executable(table)) {
			this._setupConversion('table', 'table', table);
		}

		if (this._executable(image)) {
			if (plugins.has('ImageBlock')) {
				this._setupConversion('img', 'imageBlock', image);
			}
			if (plugins.has('ImageInline')) {
				this._setupConversion('img', 'imageInline', image);
			}
		}
	}

	/**
	 *
	 * Sets up a conversion for a custom attribute on the view elements contained inside a <figure>.
	 *
	 * This method:
	 * - Adds proper schema rules.
	 * - Adds an upcast converter.
	 * - Adds a downcast converter.
	 */
	_setupConversion(viewElName, modelElName, viewAttribute) {
		const editor = this.editor;

		// Extends the schema to store an attribute in the model.
		const modelAttribute = `custom-${viewAttribute}`;
		editor.model.schema.extend(modelElName, { allowAttributes: [modelAttribute] });

		editor.conversion.for('upcast').add(this._upcast(viewElName, viewAttribute, modelAttribute));
		editor.conversion.for('downcast').add(this._downcast(modelElName, viewElName, viewAttribute, modelAttribute));
	}

	/**
	 * Returns the custom attribute upcast converter.
	 */
	_upcast(viewElName, viewAttribute, modelAttribute) {
		return (dispatcher) => {
			dispatcher.on(`element:${viewElName}`, (evt, data, conversionApi) => {
				const viewItem = data.viewItem;
				const modelRange = data.modelRange;
				const modelElement = modelRange && modelRange.start.nodeAfter;

				if (!modelElement) {
					return;
				}

				conversionApi.writer.setAttribute(modelAttribute, viewItem.getAttribute(viewAttribute) ?? '', modelElement);
			});
		};
	}

	/**
	 * Returns the custom attribute downcast converter.
	 */
	_downcast(modelElName, viewElName, viewAttr, modelAttr) {
		return (dispatcher) =>
			dispatcher.on(`insert:${modelElName}`, (evt, data, conversionApi) => {
				const modelElement = data.item;
				const viewFigure = conversionApi.mapper.toViewElement(modelElement);
				const viewElement = this._findViewChild(viewFigure, viewElName, conversionApi);

				if (!viewElement) {
					return;
				}

				conversionApi.writer.setAttribute(viewAttr, modelElement.getAttribute(modelAttr) ?? '', viewElement);
			});
	}

	/**
	 * Helper method that searches for a given view element in all children of the model element.
	 */
	_findViewChild(viewElement, viewElName, conversionApi) {
		const viewChildren = Array.from(conversionApi.writer.createRangeIn(viewElement).getItems());
		return viewChildren.find((item) => item.is('element', viewElName));
	}

	_executable(attributes) {
		if (typeof attributes === 'string' && attributes.length) {
			return true;
		}
		return attributes instanceof Array && attributes.length;
	}
}

export { FigureAttributes };
