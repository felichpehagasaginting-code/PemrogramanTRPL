// Monaco Editor Theme Definitions & Font Ligatures Config

export interface EditorThemeOption {
  id: string;
  name: string;
  base: "vs" | "vs-dark" | "hc-black";
  inherit: boolean;
  rules: any[];
  colors: Record<string, string>;
}

export const MONACO_CUSTOM_THEMES: Record<string, EditorThemeOption> = {
  "dracula": {
    id: "dracula",
    name: "🧛 Dracula Pro",
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4", fontStyle: "italic" },
      { token: "keyword", foreground: "ff79c6", fontStyle: "bold" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
      { token: "identifier", foreground: "f8f8f2" },
      { token: "type", foreground: "8be9fd" },
    ],
    colors: {
      "editor.background": "#282a36",
      "editor.foreground": "#f8f8f2",
      "editor.lineHighlightBackground": "#44475a40",
      "editorCursor.foreground": "#f8f8f0",
      "editorWhitespace.foreground": "#6272a450",
    },
  },
  "one-dark-pro": {
    id: "one-dark-pro",
    name: "✨ One Dark Pro",
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "5c6370", fontStyle: "italic" },
      { token: "keyword", foreground: "c678dd", fontStyle: "bold" },
      { token: "string", foreground: "98c379" },
      { token: "number", foreground: "d19a66" },
      { token: "identifier", foreground: "abb2bf" },
      { token: "type", foreground: "61afef" },
    ],
    colors: {
      "editor.background": "#21252b",
      "editor.foreground": "#abb2bf",
      "editor.lineHighlightBackground": "#2c313a",
      "editorCursor.foreground": "#528bff",
    },
  },
  "monokai": {
    id: "monokai",
    name: "🌴 Monokai Classic",
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "75715e", fontStyle: "italic" },
      { token: "keyword", foreground: "f92672", fontStyle: "bold" },
      { token: "string", foreground: "e6db74" },
      { token: "number", foreground: "ae81ff" },
      { token: "identifier", foreground: "f8f8f2" },
      { token: "type", foreground: "66d9ef" },
    ],
    colors: {
      "editor.background": "#272822",
      "editor.foreground": "#f8f8f2",
      "editor.lineHighlightBackground": "#3e3d32",
      "editorCursor.foreground": "#f8f8f0",
    },
  },
  "github-dark": {
    id: "github-dark",
    name: "🐙 GitHub Dark Dimmed",
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "768390", fontStyle: "italic" },
      { token: "keyword", foreground: "f47067", fontStyle: "bold" },
      { token: "string", foreground: "96d0ff" },
      { token: "number", foreground: "6cb6ff" },
      { token: "identifier", foreground: "adbac7" },
    ],
    colors: {
      "editor.background": "#1c2128",
      "editor.foreground": "#adbac7",
      "editor.lineHighlightBackground": "#2d333b",
      "editorCursor.foreground": "#539bf5",
    },
  },
};

export function defineMonacoThemes(monacoInstance: any) {
  if (!monacoInstance || !monacoInstance.editor) return;

  Object.entries(MONACO_CUSTOM_THEMES).forEach(([themeKey, themeData]) => {
    try {
      monacoInstance.editor.defineTheme(themeKey, {
        base: themeData.base,
        inherit: themeData.inherit,
        rules: themeData.rules,
        colors: themeData.colors,
      });
    } catch {
      // ignore re-definition
    }
  });
}
