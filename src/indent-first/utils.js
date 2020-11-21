import { ATTRIBUTE } from './index';

/**
 * judgment whether the indent first button can be executed
 *
 * @param schema
 * @param firstBlock
 * @returns {boolean}
 */
export function indentFirstExecutable(schema, firstBlock) {
	return schema.checkAttribute(firstBlock, ATTRIBUTE);
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
