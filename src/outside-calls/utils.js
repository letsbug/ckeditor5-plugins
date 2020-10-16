export function isSupported(option) {
	const { name, icon, label, command } = option;
	return typeof name === 'string' && typeof icon === 'string' && typeof label === 'string' && typeof command === 'function';
}
