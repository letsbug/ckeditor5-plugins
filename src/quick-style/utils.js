import { fields } from './ui/form';

/**
 * check fields when the quickStyle executes
 *
 * @param obj
 * @returns {boolean}
 */
export function checkFields(obj) {
	return !!obj && Object.keys(obj).every((key) => fields.some((f) => f.name === key));
}

// export function clearLinks(writer)
