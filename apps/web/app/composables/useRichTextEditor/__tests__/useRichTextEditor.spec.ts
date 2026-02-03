import { useRichTextEditor } from '../useRichTextEditor';
import type { UseRichTextEditorArgs } from '../types';
import { createRichTextEditorTestArgs } from './test-utils';

const {
  editorMock,
  chainSpy,
  setColorSpy,
  setHighlightSpy,
  setTextAlignSpy,
  unsetAllMarksSpy,
  clearNodesSpy,
  undoSpy,
  redoSpy,
  unsetLinkSpy,
  setLinkSpy,
  extendMarkRangeSpy,
  runSpy,
  focusSpy,
  isActiveSpy,
} = vi.hoisted(() => {
  const setColorSpy = vi.fn();
  const setHighlightSpy = vi.fn();
  const setTextAlignSpy = vi.fn();
  const toggleHeadingSpy = vi.fn();
  const unsetAllMarksSpy = vi.fn();
  const clearNodesSpy = vi.fn();
  const undoSpy = vi.fn();
  const redoSpy = vi.fn();
  const unsetLinkSpy = vi.fn();
  const setLinkSpy = vi.fn();
  const extendMarkRangeSpy = vi.fn();
  const runSpy = vi.fn();
  const focusSpy = vi.fn();
  const isActiveSpy = vi.fn().mockReturnValue(false);

  const chainReturn: Record<string, (...args: unknown[]) => unknown> = {};

  chainReturn.setColor = (...args: unknown[]) => {
    setColorSpy(...args);
    return chainReturn;
  };

  chainReturn.setHighlight = (...args: unknown[]) => {
    setHighlightSpy(...args);
    return chainReturn;
  };

  chainReturn.setTextAlign = (...args: unknown[]) => {
    setTextAlignSpy(...args);
    return chainReturn;
  };

  chainReturn.toggleHeading = (...args: unknown[]) => {
    toggleHeadingSpy(...args);
    return chainReturn;
  };

  chainReturn.focus = (...args: unknown[]) => {
    focusSpy(...args);
    return chainReturn;
  };

  chainReturn.undo = (...args: unknown[]) => {
    undoSpy(...args);
    return chainReturn;
  };

  chainReturn.redo = (...args: unknown[]) => {
    redoSpy(...args);
    return chainReturn;
  };

  chainReturn.unsetAllMarks = (...args: unknown[]) => {
    unsetAllMarksSpy(...args);
    return chainReturn;
  };

  chainReturn.clearNodes = (...args: unknown[]) => {
    clearNodesSpy(...args);
    return chainReturn;
  };

  chainReturn.extendMarkRange = (...args: unknown[]) => {
    extendMarkRangeSpy(...args);
    return chainReturn;
  };

  chainReturn.unsetLink = (...args: unknown[]) => {
    unsetLinkSpy(...args);
    return chainReturn;
  };

  chainReturn.setLink = (...args: unknown[]) => {
    setLinkSpy(...args);
    return chainReturn;
  };

  chainReturn.run = (...args: unknown[]) => {
    runSpy(...args);
    return chainReturn;
  };

  const chainSpy = vi.fn(() => chainReturn);

  const onSpy = vi.fn();
  const getAttributesSpy = vi.fn().mockReturnValue({});
  const canSpy = vi.fn(() => {
    return {
      undo: () => false,
      redo: () => false,
    };
  });

  const getHTMLSpy = vi.fn(() => '');

  const editorMock = {
    chain: chainSpy,
    on: onSpy,
    getAttributes: getAttributesSpy,
    can: canSpy,
    isActive: isActiveSpy,
    getHTML: getHTMLSpy,
    commands: {
      focus: vi.fn(),
    },
  } as unknown as {
    chain: () => unknown;
    on: (event: string, cb: (...args: unknown[]) => void) => void;
  };

  return {
    editorMock,
    chainSpy,
    setColorSpy,
    setHighlightSpy,
    setTextAlignSpy,
    toggleHeadingSpy,
    unsetAllMarksSpy,
    clearNodesSpy,
    undoSpy,
    redoSpy,
    unsetLinkSpy,
    setLinkSpy,
    extendMarkRangeSpy,
    runSpy,
    focusSpy,
    isActiveSpy,
  };
});

vi.mock('@tiptap/vue-3', () => {
  return {
    useEditor: vi.fn(() => ref(editorMock)),
  };
});

describe('useRichTextEditor', () => {
  beforeEach(() => {
    isActiveSpy.mockReset();
    isActiveSpy.mockReturnValue(false);
  });

  it('should set the font color', () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { setFontColor, textColor } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    setFontColor('#ff0000');

    expect(chainSpy).toHaveBeenCalledTimes(1);
    expect(setColorSpy).toHaveBeenCalledWith('#ff0000');
    expect(runSpy).toHaveBeenCalledTimes(1);
    expect(focusSpy).not.toHaveBeenCalled();
    expect(textColor.value).toBe('#ff0000');
  });

  it('should sync expandedLocal with expanded and emit updates', async () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { expandedLocal } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    expect(expandedLocal.value).toBe(false);

    if (expanded) {
      expanded.value = true;
    }
    await nextTick();
    expect(expandedLocal.value).toBe(true);

    expandedLocal.value = false;
    await nextTick();
    expect(onUpdateExpanded).toHaveBeenLastCalledWith(false);
  });

  it('should set the highlight color', () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { setHighlightColor, highlightColor } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    setHighlightColor('#00ff00');

    expect(chainSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    expect(setHighlightSpy).toHaveBeenCalledWith({ color: '#00ff00' });
    expect(runSpy).toHaveBeenCalled();
    expect(highlightColor.value).toBe('#00ff00');
  });

  it('should focus the editor and set alignment', () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { setAlign } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    setAlign('center');

    expect(chainSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    expect(setTextAlignSpy).toHaveBeenCalledWith('center');
    expect(runSpy).toHaveBeenCalled();
  });

  it('should undo and redo history commands', () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { undo, redo } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    undo();
    redo();

    expect(chainSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    expect(undoSpy).toHaveBeenCalled();
    expect(redoSpy).toHaveBeenCalled();
    expect(runSpy).toHaveBeenCalled();
  });

  it('should clear marks and nodes', () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { clearFormatting } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    clearFormatting();

    expect(chainSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    expect(unsetAllMarksSpy).toHaveBeenCalled();
    expect(clearNodesSpy).toHaveBeenCalled();
    expect(runSpy).toHaveBeenCalled();
  });

  it('should return paragraph as default block type', () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { currentBlockType } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    expect(currentBlockType.value).toBe('paragraph');
  });

  it('should return h1 block type when heading level 1 is active', () => {
    isActiveSpy.mockImplementation((name: string, attrs?: { level?: number }) => {
      return name === 'heading' && attrs?.level === 1;
    });

    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { currentBlockType } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,

      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    expect(currentBlockType.value).toBe('h1');
  });

  it('should return h2 block type when heading level 2 is active', () => {
    isActiveSpy.mockImplementation((name: string, attrs?: { level?: number }) => {
      return name === 'heading' && attrs?.level === 2;
    });

    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { currentBlockType } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    expect(currentBlockType.value).toBe('h2');
  });

  it('should return h3 block type when heading level 3 is active', () => {
    isActiveSpy.mockImplementation((name: string, attrs?: { level?: number }) => {
      return name === 'heading' && attrs?.level === 3;
    });

    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    const { currentBlockType } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    expect(currentBlockType.value).toBe('h3');
  });

  it('should unset link when it is active', () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    isActiveSpy.mockReturnValueOnce(true);

    const { toggleLink } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    toggleLink();

    expect(chainSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    expect(unsetLinkSpy).toHaveBeenCalled();

    expect(runSpy).toHaveBeenCalled();
  });

  it('should prompt for url and set link when not active', () => {
    const { modelValue, expanded, textAlign, onUpdateModelValue, onUpdateExpanded } =
      createRichTextEditorTestArgs();

    isActiveSpy.mockReturnValue(false);

    const promptSpy = vi.spyOn(window, 'prompt').mockReturnValue('https://example.com');

    const { toggleLink } = useRichTextEditor({
      modelValue,
      onUpdateModelValue,
      expanded,
      onUpdateExpanded,
      textAlign,
    } as UseRichTextEditorArgs);

    toggleLink();

    expect(promptSpy).toHaveBeenCalled();
    expect(chainSpy).toHaveBeenCalled();
    expect(focusSpy).toHaveBeenCalled();
    expect(extendMarkRangeSpy).toHaveBeenCalledWith('link');
    expect(setLinkSpy).toHaveBeenCalledWith({ href: 'https://example.com' });
    expect(runSpy).toHaveBeenCalled();

    promptSpy.mockRestore();
  });
});
