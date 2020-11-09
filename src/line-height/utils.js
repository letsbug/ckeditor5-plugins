export function isSupported(option) {
	// return supportedOptions.includes( option );
	return option === 'Default' || /^\d(.\d+)?$/gm.test(String(option));
}

export function normalizeOptions(configuredOptions) {
	return configuredOptions.map(optionDefinition).filter((option) => !!option);
}

export function buildDefinition(options) {
	const definition = {
		model: {
			key: 'lineHeight',
			values: options.slice(),
		},
		view: {},
	};

	for (const option of options) {
		definition.view[option] = {
			key: 'style',
			value: {
				'line-height': option,
			},
		};
	}

	return definition;
}

function optionDefinition(option) {
	if (typeof option === 'object') {
		return option;
	}

	if (option === 'Default') {
		return {
			model: undefined,
			title: '默认行距',
		};
	}

	const sizePreset = parseFloat(option);

	if (isNaN(sizePreset)) {
		return;
	}

	return generatePixelPreset(sizePreset);
}

function generatePixelPreset(size) {
	const sizeName = String(size);
	const names = {
		1: '单',
		2: '双',
	};

	return {
		title: (names[sizeName] || sizeName) + '倍',
		model: size,
		view: {
			name: 'span',
			styles: {
				'line-height': sizeName,
			},
			priority: 5,
		},
	};
}
