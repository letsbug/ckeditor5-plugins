export function isSupported(option) {
	return option === 'Default' || /^\d(.\d+)?$/gm.test(String(option));
}

export function normalizeOptions(configuredOptions, unit, prop) {
	return configuredOptions.map((o) => optionDefinition(o, unit, prop)).filter((option) => !!option);
}

export function buildDefinition(options, unit) {
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
				'line-height': unit ? option + unit : option,
			},
		};
	}

	return definition;
}

function optionDefinition(option, unit, prop) {
	if (typeof option === 'object') {
		return option;
	}

	if (option === 'Default') {
		return { model: undefined, title: '默认行高' };
	}

	const size = parseFloat(option);

	if (isNaN(size)) {
		return;
	}

	const sizeName = String(size);
	const names = { 1: '单', 2: '双' };
	const result = {
		title: (names[sizeName] || sizeName) + (unit ? sizeName + unit : unit + '倍'),
		model: size,
		view: { name: 'span', priority: 5 },
	};
	result.view.styles[prop] = unit ? sizeName + unit : sizeName;
	return result;
}
