import { describe, it, expect } from 'vitest';
import { useHtmlEditorMode } from '../useHtmlEditorMode';

describe('useHtmlEditorMode', () => {
  it('should initialize with default values', () => {
    const content = ref('<div>Hello</div>');
    const { editorMode, htmlErrors, customCodeHints } = useHtmlEditorMode(content);

    expect(editorMode.value).toBe('wysiwyg');
    expect(htmlErrors.value).toEqual([]);
    expect(customCodeHints.value).toEqual([]);
  });

  it('should detect custom CSS when switching to HTML mode', () => {
    const content = ref('<style>.test { color: red; }</style><div>Hello</div>');
    const { customCodeHints, switchToHtmlMode } = useHtmlEditorMode(content);

    switchToHtmlMode();

    expect(customCodeHints.value).toHaveLength(1);
    expect(customCodeHints.value[0]).toEqual({
      type: 'css',
      message: 'customCodeHint.cssDetected',
    });
  });

  it('should detect custom JavaScript when switching to HTML mode', () => {
    const content = ref('<script>console.log("test");</script><div>Hello</div>');
    const { customCodeHints, switchToHtmlMode } = useHtmlEditorMode(content);

    switchToHtmlMode();

    expect(customCodeHints.value).toHaveLength(1);
    expect(customCodeHints.value[0]).toEqual({
      type: 'js',
      message: 'customCodeHint.jsDetected',
    });
  });

  it('should detect both CSS and JS', () => {
    const content = ref('<style>.test { color: red; }</style><script>console.log("test");</script>');
    const { customCodeHints, switchToHtmlMode } = useHtmlEditorMode(content);

    switchToHtmlMode();

    expect(customCodeHints.value).toHaveLength(2);
  });

  it('should detect hints in initial content', () => {
    const content = ref('<div>Hello</div>');
    const { customCodeHints, switchToHtmlMode } = useHtmlEditorMode(content);

    expect(customCodeHints.value).toHaveLength(0);

    content.value = '<style>.test { color: red; }</style>';
    switchToHtmlMode();

    expect(customCodeHints.value).toHaveLength(1);
  });

  it('should update ariaDescribedBy when hints are present', () => {
    const content = ref('<style>.test { color: red; }</style>');
    const { ariaDescribedBy, switchToHtmlMode } = useHtmlEditorMode(content);

    switchToHtmlMode();

    expect(ariaDescribedBy.value).toContain('html-editor-hints');
  });

  it('should include both errors and hints in ariaDescribedBy', () => {
    const content = ref('<style>.test { color: red; }</style><div>');
    const { ariaDescribedBy, switchToHtmlMode } = useHtmlEditorMode(content);

    switchToHtmlMode();

    expect(ariaDescribedBy.value).toContain('html-editor-errors');
    expect(ariaDescribedBy.value).toContain('html-editor-hints');
  });
});
