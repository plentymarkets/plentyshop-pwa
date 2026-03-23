export type RteAlign = 'left' | 'center' | 'right' | 'justify';
export type RteBlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type UseRichTextEditorArgs = {
  modelValue: Ref<string | undefined>;
  onUpdateModelValue: (html: string) => void;
  expanded?: Ref<boolean | undefined>;
  onUpdateExpanded?: (v: boolean) => void;
  textAlign?: Ref<RteAlign | undefined>;
  placeholder?: Ref<string | undefined>;
};
export type RteCommand =
  | 'toggleBold'
  | 'toggleItalic'
  | 'toggleUnderline'
  | 'toggleBlockquote'
  | 'toggleStrike'
  | 'toggleBulletList'
  | 'toggleOrderedList'
  | 'setHorizontalRule';
