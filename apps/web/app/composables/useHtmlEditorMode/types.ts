export type EditorMode = 'wysiwyg' | 'html';

export type UseHtmlEditorModeOptions = {
  defaultMode?: EditorMode;
  commitOnValid?: boolean;
  maxErrors?: number;
};
export type HtmlToken =
  | { kind: 'comment' | 'doctype' | 'processing-instruction' }
  | { kind: 'tag'; tagName: string; attributesSource: string; isClosing: boolean; isSelfClosing: boolean };
