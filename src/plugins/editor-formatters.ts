import type { Plugin } from "@/core/plugin";
import type * as monaco from "monaco-editor";
import prettier, { type Options } from "prettier";
import parserMarkdown from "prettier/parser-markdown";
import parserYaml from "prettier/parser-yaml";
import parserHtml from "prettier/parser-html";
import parserTypescript from "prettier/parser-typescript";

const prettierOption: Options = {
	arrowParens: "always",
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: "auto",
	htmlWhitespaceSensitivity: "css",
	insertPragma: false,
	jsxSingleQuote: false,
	printWidth: 200,
	proseWrap: "never",
	quoteProps: "as-needed",
	requirePragma: false,
	semi: true,
	singleQuote: false,
	tabWidth: 2,
	useTabs: false,
	vueIndentScriptAndStyle: false,
	parser: "markdown",
	plugins: [parserMarkdown, parserYaml, parserHtml, parserTypescript],
};

export default <Plugin>{
	name: "editor-formatters",
	register(ctx) {
		const monaco = ctx.editor.getMonaco();
		const documentProvider: monaco.languages.DocumentFormattingEditProvider = {
			provideDocumentFormattingEdits: (model) => {
				const lineCount = model.getLineCount();
				return [
					{
						range: new monaco.Range(1, 1, lineCount, model.getLineMaxColumn(lineCount) + 1),
						text: prettier.format(model.getValue(), prettierOption) /* cssBeautify(model.getValue(), beautyOption), */,
					},
				];
			},
		};

		const rangeProvider: monaco.languages.DocumentRangeFormattingEditProvider = {
			provideDocumentRangeFormattingEdits: (model, range) => {
				const fullLineRange = new monaco.Range(range.startLineNumber, 1, range.endLineNumber, model.getLineMaxColumn(range.endLineNumber) + 1);
				const code = model.getValueInRange(fullLineRange);

				return [
					{
						range: fullLineRange,
						text: prettier.format(code, prettierOption),
					},
				];
			},
		};

		monaco.languages.registerDocumentFormattingEditProvider("md", documentProvider);
		monaco.languages.registerDocumentRangeFormattingEditProvider("md", rangeProvider);
	},
};
