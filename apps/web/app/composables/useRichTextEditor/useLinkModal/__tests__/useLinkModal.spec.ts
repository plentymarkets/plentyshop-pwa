import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Editor } from '@tiptap/core';
import { useLinkModal } from '../useLinkModal';

const mockGetCorrectPreviewPathWithLocale = vi.fn((path: string) => path);

const { useCategoryIdHelper } = vi.hoisted(() => ({
  useCategoryIdHelper: vi.fn(() => ({
    getCorrectPreviewPathWithLocale: mockGetCorrectPreviewPathWithLocale,
  })),
}));

mockNuxtImport('useCategoryIdHelper', () => useCategoryIdHelper);

type ChainMock = Record<
  | 'focus'
  | 'setTextSelection'
  | 'setNodeSelection'
  | 'deleteSelection'
  | 'insertContent'
  | 'setLink'
  | 'unsetLink'
  | 'run',
  ReturnType<typeof vi.fn>
>;

const createChain = (): ChainMock => {
  const c = {} as ChainMock;
  for (const m of [
    'focus',
    'setTextSelection',
    'setNodeSelection',
    'deleteSelection',
    'insertContent',
    'setLink',
    'unsetLink',
    'run',
  ] as const) {
    c[m] = vi.fn().mockReturnThis();
  }
  return c;
};

const createEditor = (
  opts: {
    from?: number;
    to?: number;
    textBetween?: string;
    nodesInRange?: object[];
    cursorMarks?: object[];
    storedMarks?: object[] | null;
  } = {},
): { editor: Editor | null | undefined; chain: ChainMock } => {
  const { from = 0, to = 0, textBetween = '', nodesInRange = [], cursorMarks = [], storedMarks = null } = opts;
  const chain = createChain();
  const editor = {
    chain: vi.fn(() => chain),
    state: {
      selection: { from, to, $from: { marks: () => cursorMarks } },
      storedMarks,
      doc: {
        nodesBetween: vi.fn((_f: number, _t: number, cb: (n: object) => boolean) => {
          for (const node of nodesInRange) {
            if (cb(node) === false) break;
          }
        }),
        textBetween: vi.fn(() => textBetween),
      },
    },
  } as unknown as Editor;
  return { editor, chain };
};

const makeEditorRef = (e: Editor | null | undefined) => shallowRef(e);

describe('useLinkModal', () => {
  beforeEach(() => {
    mockGetCorrectPreviewPathWithLocale.mockImplementation((path: string) => path);
  });

  describe('initFromEditor', () => {
    it('should set empty state for a cursor position with no link', async () => {
      const { editor } = createEditor();
      const { linkText, urlValue, activeTab, isAtomSelection, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      expect(linkText.value).toBe('');
      expect(urlValue.value).toBe('');
      expect(activeTab.value).toBe('url');
      expect(isAtomSelection.value).toBe(false);
    });

    it('should prefill linkText and urlValue when text with a URL link is selected', async () => {
      const linkMark = {
        type: { name: 'link' },
        attrs: {
          href: 'https://example.com',
          target: '_self',
          'data-link-type': 'url',
          'data-link-value': 'https://example.com',
        },
      };
      const { editor } = createEditor({
        from: 0,
        to: 11,
        textBetween: 'hello world',
        nodesInRange: [{ type: { name: 'text' }, marks: [linkMark], isAtom: false, isInline: false, attrs: {} }],
      });
      const { linkText, urlValue, activeTab, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      expect(linkText.value).toBe('hello world');
      expect(urlValue.value).toBe('https://example.com');
      expect(activeTab.value).toBe('url');
    });

    it('should set activeTab to category when the link href contains /c/', async () => {
      const linkMark = {
        type: { name: 'link' },
        attrs: { href: '/c/123', target: '_self' },
      };
      const { editor } = createEditor({
        from: 0,
        to: 5,
        textBetween: 'shoes',
        nodesInRange: [{ type: { name: 'text' }, marks: [linkMark], isAtom: false, isInline: false, attrs: {} }],
      });
      const { activeTab, categoryValue, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      expect(activeTab.value).toBe('category');
      expect(categoryValue.value).toBe('/c/123');
    });

    it('should set activeTab to static when the link href is a relative path', async () => {
      const linkMark = {
        type: { name: 'link' },
        attrs: { href: '/imprint', target: '_self' },
      };
      const { editor } = createEditor({
        from: 0,
        to: 7,
        textBetween: 'Imprint',
        nodesInRange: [{ type: { name: 'text' }, marks: [linkMark], isAtom: false, isInline: false, attrs: {} }],
      });
      const { activeTab, staticPageValue, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      expect(activeTab.value).toBe('static');
      expect(staticPageValue.value).toBe('/imprint');
    });

    it('should detect atom selection and set atomDisplayLabel for an icon node', async () => {
      const { editor } = createEditor({
        from: 0,
        to: 1,
        textBetween: ' ',
        nodesInRange: [{ type: { name: 'icon' }, marks: [], isAtom: true, isInline: true, attrs: { name: 'star' } }],
      });
      const { isAtomSelection, atomDisplayLabel, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      expect(isAtomSelection.value).toBe(true);
      expect(atomDisplayLabel.value).toBe('star [icon]');
    });

    it('should set openInNewWindow when the existing link has target _blank', async () => {
      const linkMark = {
        type: { name: 'link' },
        attrs: {
          href: 'https://example.com',
          target: '_blank',
          'data-link-type': 'url',
          'data-link-value': 'https://example.com',
        },
      };
      const { editor } = createEditor({
        from: 0,
        to: 4,
        textBetween: 'link',
        nodesInRange: [{ type: { name: 'text' }, marks: [linkMark], isAtom: false, isInline: false, attrs: {} }],
      });
      const { openInNewWindow, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      expect(openInNewWindow.value).toBe(true);
    });

    it('should restore selected rel attributes from link metadata', async () => {
      const linkMark = {
        type: { name: 'link' },
        attrs: {
          href: 'https://example.com',
          target: '_self',
          rel: 'noopener noreferrer',
          'data-link-rel': 'noopener noreferrer',
          'data-link-type': 'url',
          'data-link-value': 'https://example.com',
        },
      };
      const { editor } = createEditor({
        from: 0,
        to: 4,
        textBetween: 'link',
        nodesInRange: [{ type: { name: 'text' }, marks: [linkMark], isAtom: false, isInline: false, attrs: {} }],
      });
      const { relValues, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      expect(relValues.value).toEqual(['noopener', 'noreferrer']);
    });
  });

  describe('computedHref', () => {
    it('should return urlValue for the url tab', async () => {
      const { editor } = createEditor();
      const { computedHref, urlValue, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      urlValue.value = 'https://example.com';

      expect(computedHref.value).toBe('https://example.com');
    });

    it('should return empty string for static tab when staticPageValue is empty', async () => {
      const { editor } = createEditor();
      const { computedHref, activeTab, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      activeTab.value = 'static';

      expect(computedHref.value).toBe('');
    });

    it('should resolve via getCorrectPreviewPathWithLocale for static tab', async () => {
      mockGetCorrectPreviewPathWithLocale.mockReturnValue('/en/imprint');
      const { editor } = createEditor();
      const { computedHref, activeTab, staticPageValue, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      activeTab.value = 'static';
      staticPageValue.value = '/imprint';

      expect(computedHref.value).toBe('/en/imprint');
    });
  });

  describe('canSubmit', () => {
    it('should return true for a valid https URL', async () => {
      const { editor } = createEditor();
      const { canSubmit, urlValue, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      urlValue.value = 'https://example.com';

      expect(canSubmit.value).toBe(true);
    });

    it('should return false for an invalid URL', async () => {
      const { editor } = createEditor();
      const { canSubmit, urlValue, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      urlValue.value = 'not-a-url';

      expect(canSubmit.value).toBe(false);
    });

    it('should return true for category tab when a category path resolves', async () => {
      mockGetCorrectPreviewPathWithLocale.mockReturnValue('/c/123');
      const { editor } = createEditor();
      const { canSubmit, activeTab, selectedCategoryPath, initFromEditor } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      activeTab.value = 'category';
      selectedCategoryPath.value = '/c/123';

      expect(canSubmit.value).toBe(true);
    });
  });

  describe('applyLivePreview via watcher', () => {
    it('should apply text changes when linkText changes on an existing selection', async () => {
      const { editor, chain } = createEditor({ from: 0, to: 11, textBetween: 'hello world' });
      const { initFromEditor, linkText } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      linkText.value = 'hello universe';
      await nextTick();

      expect(chain.deleteSelection).toHaveBeenCalled();
      expect(chain.insertContent).toHaveBeenCalledWith('hello universe');
      expect(chain.run).toHaveBeenCalled();
    });

    it('should call setLink with correct attrs when urlValue is set to a valid URL', async () => {
      const { editor, chain } = createEditor();
      const { initFromEditor, urlValue } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      urlValue.value = 'https://example.com';
      await nextTick();

      expect(chain.setLink).toHaveBeenCalledWith(
        expect.objectContaining({ href: 'https://example.com', target: '_self' }),
      );
      expect(chain.run).toHaveBeenCalled();
    });

    it('should call unsetLink when href resolves to empty', async () => {
      const { editor, chain } = createEditor();
      const { initFromEditor, openInNewWindow } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      openInNewWindow.value = true;
      await nextTick();

      expect(chain.unsetLink).toHaveBeenCalled();
    });
  });

  describe('handleSubmit', () => {
    it('should call onClose and run the chain when canSubmit is true', async () => {
      const { editor, chain } = createEditor();
      const { initFromEditor, handleSubmit, urlValue } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();
      urlValue.value = 'https://example.com';
      await nextTick();

      const onClose = vi.fn();
      handleSubmit(onClose);

      expect(onClose).toHaveBeenCalled();
      expect(chain.run).toHaveBeenCalled();
    });

    it('should not call onClose when canSubmit is false', async () => {
      const { editor } = createEditor();
      const { initFromEditor, handleSubmit } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      const onClose = vi.fn();
      handleSubmit(onClose);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe('cancelAndRevert', () => {
    it('should restore original text and call unsetLink when no initial link existed', async () => {
      const { editor, chain } = createEditor({ from: 0, to: 11, textBetween: 'hello world' });
      const { initFromEditor, cancelAndRevert } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      const onClose = vi.fn();
      cancelAndRevert(onClose);

      expect(chain.insertContent).toHaveBeenCalledWith('hello world');
      expect(chain.unsetLink).toHaveBeenCalled();
      expect(chain.run).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });

    it('should restore the original link when an initial link existed', async () => {
      const linkMark = {
        type: { name: 'link' },
        attrs: {
          href: 'https://original.com',
          target: '_self',
          'data-link-type': 'url',
          'data-link-value': 'https://original.com',
        },
      };
      const { editor, chain } = createEditor({
        from: 0,
        to: 11,
        textBetween: 'hello world',
        nodesInRange: [{ type: { name: 'text' }, marks: [linkMark], isAtom: false, isInline: false, attrs: {} }],
      });
      const { initFromEditor, cancelAndRevert } = useLinkModal(makeEditorRef(editor));

      initFromEditor();
      await nextTick();

      const onClose = vi.fn();
      cancelAndRevert(onClose);

      expect(chain.insertContent).toHaveBeenCalledWith('hello world');
      expect(chain.setLink).toHaveBeenCalledWith(expect.objectContaining({ href: 'https://original.com' }));
      expect(onClose).toHaveBeenCalled();
    });

    it('should call onClose even when initialSelection is null (not initialized)', () => {
      const { editor } = createEditor();
      const { cancelAndRevert } = useLinkModal(makeEditorRef(editor));

      const onClose = vi.fn();
      cancelAndRevert(onClose);

      expect(onClose).toHaveBeenCalled();
    });
  });
});
