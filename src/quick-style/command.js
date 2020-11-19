/**
 * @module quick-style/command
 */
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class QuickStyleCommand extends Command {
	/**
	 * @inheritDoc
	 */
	refresh() {
		this.isEnabled = true;
	}

	/**
	 * @inheritDoc
	 */
	execute() {
		//
	}
}
