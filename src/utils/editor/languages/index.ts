import * as monaco from "monaco-editor";
import { language as markdown, conf as markdownConfig } from "monaco-editor/esm/vs/basic-languages/markdown/markdown";
import { language as yaml, conf as yamlConf } from "monaco-editor/esm/vs/basic-languages/yaml/yaml";

monaco.languages.register({ id: "md" });
monaco.languages.setMonarchTokensProvider("md", markdown);
monaco.languages.setLanguageConfiguration("md", markdownConfig);

monaco.languages.register({ id: "yml" });
monaco.languages.setMonarchTokensProvider("yml", yaml);
monaco.languages.setLanguageConfiguration("yml", yamlConf);
