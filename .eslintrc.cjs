/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
	root: true,
	extends: ["plugin:vue/vue3-essential", "plugin:vue/vue3-recommended", "@vue/eslint-config-typescript", "@vue/eslint-config-prettier", "./.eslintrc-auto-import.json"],
	parserOptions: {
		ecmaVersion: "latest",
	},
	rules: {
		"vue/multi-word-component-names": "off",
		"no-async-promise-executor": "off",
	},
};
