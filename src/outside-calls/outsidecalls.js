import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import OutsideCallsEditing from './outsidecallsediting';
import OutsideCallsUI from './outsidecallsui';

export default class OutsideCalls extends Plugin {
	static get requires() {
		return [OutsideCallsEditing, OutsideCallsUI];
	}

	static get pluginName() {
		return 'OutsideCalls';
	}
}
