/**
 * override module:upload/adapters/simpleuploadadapter
 *
 * @module simple-adapter/index
 */

import { Plugin } from '@ckeditor/ckeditor5-core';
import { FileRepository } from '@ckeditor/ckeditor5-upload';
import { logWarning } from '@ckeditor/ckeditor5-utils';

class SimpleAdapter extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get requires() {
		return [FileRepository];
	}

	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'SimpleAdapter';
	}

	/**
	 * @inheritDoc
	 */
	init() {
		const options = this.editor.config.get('simpleUpload');

		if (!options) {
			return;
		}

		if (!options.uploadUrl) {
			logWarning('simple-upload-adapter-missing-uploadurl');
			return;
		}

		this.editor.plugins.get(FileRepository).createUploadAdapter = (loader) => {
			return new Adapter(loader, options);
		};
	}
}

/**
 * Upload adapter.
 *
 * @private
 * @implements module:upload/filerepository~UploadAdapter
 */
class Adapter {
	/**
	 * Creates a new adapter instance.
	 *
	 * @param loader {module:upload/filerepository~FileLoader}
	 * @param options {Object}
	 */
	constructor(loader, options) {
		this.loader = loader;
		this.options = options;
	}

	/**
	 * Starts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#upload
	 * @returns {Promise}
	 */
	upload() {
		return this.loader.file.then(
			(file) =>
				// eslint-disable-next-line no-undef
				new Promise((resolve, reject) => {
					this._initRequest();
					this._initListeners(resolve, reject, file);
					this._sendRequest(file);
				})
		);
	}

	/**
	 * Aborts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#abort
	 * @returns {Promise}
	 */
	abort() {
		if (this.xhr) {
			this.xhr.abort();
		}
	}

	/**
	 * Initializes the `XMLHttpRequest` object using the URL specified as
	 * {@link module:upload/adapters/simpleuploadadapter~SimpleUploadConfig#uploadUrl `simpleUpload.uploadUrl`} in the editor's
	 * configuration.
	 *
	 * @private
	 */
	_initRequest() {
		const xhr = (this.xhr = new XMLHttpRequest());

		xhr.open('POST', this.options.uploadUrl, true);
		xhr.responseType = 'json';
	}

	/**
	 * Initializes XMLHttpRequest listeners
	 *
	 * @private
	 * @param {Function} resolve Callback function to be called when the request is successful.
	 * @param {Function} reject Callback function to be called when the request cannot be completed.
	 * @param {File} file Native File object.
	 */
	_initListeners(resolve, reject, file) {
		const xhr = this.xhr;
		const loader = this.loader;
		const genericErrorText = `Couldn't upload file: ${file.name}.`;

		xhr.addEventListener('error', () => reject(genericErrorText));
		xhr.addEventListener('abort', () => reject());
		xhr.addEventListener('load', () => {
			const response = xhr.response;

			if (!response || response.error) {
				return reject(response && response.error && response.error.message ? response.error.message : genericErrorText);
			}

			resolve(response.url ? { default: response.url } : response.urls);
		});

		// Upload progress when it is supported.
		/* istanbul ignore else */
		if (xhr.upload) {
			xhr.upload.addEventListener('progress', (evt) => {
				if (evt.lengthComputable) {
					loader.uploadTotal = evt.total;
					loader.uploaded = evt.loaded;
				}
			});
		}
	}

	/**
	 * Prepares the data and sends the request.
	 *
	 * @private
	 * @param {File} file File instance to be uploaded.
	 */
	_sendRequest(file) {
		// Set headers if specified.
		const headers = this.options.headers || {};

		// Use the withCredentials flag if specified.
		const withCredentials = this.options.withCredentials || false;

		for (const headerName of Object.keys(headers)) {
			this.xhr.setRequestHeader(headerName, headers[headerName]);
		}

		this.xhr.withCredentials = withCredentials;

		// Prepare the form data.
		const data = new FormData();

		/**
		 * @override module:upload/adapters/simpleuploadadapter~Adapter#_sendRequest
		 */
		data.append(this.options.key || 'file', file);

		// Send the request.
		this.xhr.send(data);
	}
}

export { SimpleAdapter };
