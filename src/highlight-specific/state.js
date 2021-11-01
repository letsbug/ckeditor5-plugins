import { Collection, mix, ObservableMixin } from '@ckeditor/ckeditor5-utils';

export class HighlightSpecificState {
	/**
	 *
	 * @param {module:engine/model/model~Model} model model
	 * @param {HighlightSpecificConfig} config
	 */
	constructor(model, config) {
		Object.keys(config).forEach((color) => {
			this.set(color, new Collection());
		});

		// this.results.on('change', (eventInfo));
	}

	clear(model, color) {
		model.change((writer) => {
			[...this[color]].forEach(({ marker }) => {
				writer.removeMarker(marker);
			});
		});

		this[color].clear();
	}
}

mix(HighlightSpecificState, ObservableMixin);
