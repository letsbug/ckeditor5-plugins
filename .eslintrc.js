/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/* eslint-env node */

'use strict';

module.exports = {
	env: {
		browser: true,
		node: true,
	},
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	extends: ['eslint:recommended', 'prettier'],
	rules: {
		'prettier/prettier': ['error'],
		'no-useless-constructor': 'off',
	},
};
