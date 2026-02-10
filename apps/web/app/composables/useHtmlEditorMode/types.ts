export type EditorMode = 'wysiwyg' | 'html';

export type UseHtmlEditorModeOptions = {
  defaultMode?: EditorMode;
  commitOnValid?: boolean;
  maxErrors?: number;
};
