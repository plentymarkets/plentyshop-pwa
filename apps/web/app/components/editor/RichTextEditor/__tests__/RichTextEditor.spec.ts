import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import RichTextEditor from '../RichTextEditor.vue';
import EditorRichTextEditorMenuButton from '../RichTextEditorMenuButton.vue';
import { createMockUseRichTextEditor } from './test-utils';

const { useRichTextEditor } = vi.hoisted(() => {
  return {
    useRichTextEditor: vi.fn(),
  };
});

mockNuxtImport('useRichTextEditor', () => useRichTextEditor);

describe('RichTextEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default props', () => {
    useRichTextEditor.mockReturnValue(createMockUseRichTextEditor());

    const wrapper = mount(RichTextEditor, {
      global: {
        stubs: {
          EditorContent: true,
          EditorColorPicker: true,
        },
      },
    });

    expect(useRichTextEditor).toHaveBeenCalledTimes(1);
    expect(useRichTextEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        modelValue: expect.objectContaining({ value: '' }),
        expanded: expect.objectContaining({ value: false }),
        textAlign: expect.objectContaining({ value: 'left' }),
      }),
    );

    const expandButton = wrapper.get('[data-testid="rte-expand"]');
    expect(expandButton.attributes('aria-expanded')).toBe('false');

    const editorContent = wrapper.getComponent({ name: 'EditorContent' });
    expect(editorContent.attributes('style') || '').toContain('min-height: 120px');
  });

  it('should initialize with provided props', () => {
    useRichTextEditor.mockReturnValue(
      createMockUseRichTextEditor({
        expandedLocal: ref(true),
        textAlignStyle: ref({ textAlign: 'center' }),
      }),
    );

    const wrapper = mount(RichTextEditor, {
      props: {
        modelValue: '<p>Hello</p>',
        minHeight: 200,
        expandable: false,
        expanded: true,
        textAlign: 'center',
      },
      global: {
        stubs: {
          EditorContent: true,
          EditorColorPicker: true,
        },
      },
    });

    expect(useRichTextEditor).toHaveBeenCalledTimes(1);
    expect(useRichTextEditor).toHaveBeenCalledWith(
      expect.objectContaining({
        modelValue: expect.objectContaining({ value: '<p>Hello</p>' }),
        expanded: expect.objectContaining({ value: true }),
        textAlign: expect.objectContaining({ value: 'center' }),
      }),
    );

    expect(wrapper.find('[data-testid="rte-expand"]').exists()).toBe(false);

    const editorContent = wrapper.getComponent({ name: 'EditorContent' });
    expect(editorContent.attributes('style') || '').toContain('min-height: 200px');
  });

  it('should call cmd with correct commands when basic formatting buttons are clicked', async () => {
    const cmd = vi.fn();

    useRichTextEditor.mockReturnValue(createMockUseRichTextEditor({ cmd }));

    const wrapper = mount(RichTextEditor, {
      global: {
        stubs: {
          EditorContent: true,
          EditorColorPicker: true,
        },
      },
    });

    const toolbarButtons = wrapper.get('[data-testid="rte-toolbar"]').findAllComponents(EditorRichTextEditorMenuButton);

    await toolbarButtons[0].trigger('click');
    await toolbarButtons[1].trigger('click');
    await toolbarButtons[2].trigger('click');

    expect(cmd).toHaveBeenCalledWith('toggleBold');
    expect(cmd).toHaveBeenCalledWith('toggleItalic');
    expect(cmd).toHaveBeenCalledWith('toggleUnderline');
  });

  it('should toggle expandedLocal when expand button is clicked', async () => {
    const expandedLocal = ref(false);

    useRichTextEditor.mockReturnValue(createMockUseRichTextEditor({ expandedLocal }));

    const wrapper = mount(RichTextEditor, {
      global: {
        stubs: {
          EditorContent: true,
          EditorColorPicker: true,
        },
      },
    });

    const expandButton = wrapper.get('[data-testid="rte-expand"]');
    expect(expandedLocal.value).toBe(false);
    expect(expandButton.attributes('aria-expanded')).toBe('false');

    await expandButton.trigger('click');

    expect(expandedLocal.value).toBe(true);
    expect(expandButton.attributes('aria-expanded')).toBe('true');
    expect(wrapper.find('[data-testid="rte-toolbar-expanded"]').exists()).toBe(true);
  });

  it('should call toggleLink, undo and redo from toolbars', async () => {
    const toggleLink = vi.fn();
    const undo = vi.fn();
    const redo = vi.fn();

    useRichTextEditor.mockReturnValue(
      createMockUseRichTextEditor({
        expandedLocal: ref(true),
        textAlignStyle: ref({ textAlign: 'left' }),
        canUndo: ref(true),
        canRedo: ref(true),
        undo,
        redo,
        toggleLink,
      }),
    );

    const wrapper = mount(RichTextEditor, {
      global: {
        stubs: {
          EditorContent: true,
          EditorColorPicker: true,
        },
      },
    });

    const linkButton = wrapper.get('[data-testid="rte-link-button"]');
    await linkButton.trigger('click');
    expect(toggleLink).toHaveBeenCalledTimes(1);

    const undoButton = wrapper.get('[data-testid="rte-undo-button"]');
    const redoButton = wrapper.get('[data-testid="rte-redo-button"]');

    await undoButton.trigger('click');
    await redoButton.trigger('click');

    expect(undo).toHaveBeenCalledTimes(1);
    expect(redo).toHaveBeenCalledTimes(1);
  });
});
