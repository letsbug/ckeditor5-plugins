export function isSupported(option) {
	return option === 'Default' || /^\d(\d)?$/gm.test(String(option));
}

export function normalizeOptions(configuredOptions, unit, prop) {
	return configuredOptions.map((o) => optionDefinition(o, unit, prop)).filter((option) => !!option);
}

export function buildDefinition(options, unit, prop) {
	const styleProp = {
		lineHeight: 'line-height',
		paragraphSpacing: 'margin-top',
	};
	const definition = {
		model: {
			key: prop,
			values: options.slice(),
		},
		view: {},
	};

	for (const option of options) {
		const result = {
			key: 'style',
			value: {},
		};
		result.value[styleProp[prop]] = unit ? option + unit : option;
		definition.view[option] = result;
	}

	return definition;
}

function optionDefinition(option, unit, prop) {
	if (typeof option === 'object') {
		return option;
	}

	if (option === 'Default') {
		return { model: undefined, title: prop === 'line-height' ? '默认行高' : '默认间距' };
	}

	const size = parseFloat(option);

	if (isNaN(size)) {
		return;
	}

	const sizeName = String(size);
	const named = { 1: '单', 2: '双' }[sizeName];
	const result = {
		title: named ? named + '倍' : unit ? sizeName + unit : sizeName + '倍',
		model: size,
		view: { name: 'span', priority: 5, styles: {} },
	};
	result.view.styles[prop] = unit ? sizeName + unit : sizeName;
	return result;
}
