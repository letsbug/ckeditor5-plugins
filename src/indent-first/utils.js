import { ATTRIBUTE } from './index';

/**
 * Elements that need to be excluded during command execution and condition judgment
 *
 * @type {string[]}
 */
export const excludes = ['image', 'media', 'table'];

/**
 * Identify whether the indent first button can be executed
 *
 * @param schema
 * @param block
 * @returns {boolean}
 */
export function indentFirstExecutable(schema, block) {
	return schema.checkAttribute(block, ATTRIBUTE);
}

/**
 * Execute indent first command
 *
 * @param writer
 * @param blocks
 */
export function indentFirst(writer, blocks) {
	const firstBlock = blocks[0].getAttribute(ATTRIBUTE);
	const isRemove = firstBlock === ATTRIBUTE || !ATTRIBUTE;

	for (const block of blocks) {
		if (isRemove) {
			writer.removeAttribute(ATTRIBUTE, block);
		} else {
			writer.setAttribute(ATTRIBUTE, ATTRIBUTE, block);
		}
	}
}
