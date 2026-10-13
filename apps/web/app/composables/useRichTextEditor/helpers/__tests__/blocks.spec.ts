import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import { HeadingVariant } from '../headingExtension';
import { setupRichTextEditorBlocks } from '../blocks';
import { RTE_FOOTER_BLOCK_TYPE } from '../../constants';

describe('rich text heading variants', () => {
  let editor: Editor;

  const createEditor = (content: string) => {
    editor = new Editor({
      extensions: [StarterKit, HeadingVariant],
      content: `${content}<p>Links</p>`,
    });
    editor.commands.setTextSelection(1);
    return setupRichTextEditorBlocks(shallowRef(editor), () => editor.chain());
  };

  afterEach(() => editor?.destroy());

  it('should preserve the footer variant through an HTML round trip', () => {
    const html = '<h2 data-heading-variant="footer">Legal</h2>';
    const { currentBlockType } = createEditor(html);

    expect(currentBlockType.value).toBe(RTE_FOOTER_BLOCK_TYPE);
    expect(editor.getHTML()).toBe(`${html}<p>Links</p>`);
    editor.commands.setContent(editor.getHTML());
    expect(editor.getHTML()).toBe(`${html}<p>Links</p>`);
  });

  it('should change a normal h2 to a footer h2 without toggling to a paragraph', () => {
    const { onFontSizeChange, currentBlockType } = createEditor('<h2>Legal</h2>');
    expect(currentBlockType.value).toBe('h2');

    onFontSizeChange(RTE_FOOTER_BLOCK_TYPE);

    expect(editor.getHTML()).toBe('<h2 data-heading-variant="footer">Legal</h2><p>Links</p>');
  });

  it.each(['h2', 'h5', 'paragraph'])('should clear the footer variant when selecting %s', (blockType) => {
    const { onFontSizeChange } = createEditor('<h2 data-heading-variant="footer">Legal</h2>');

    onFontSizeChange(blockType);

    const tag = blockType === 'paragraph' ? 'p' : blockType;
    expect(editor.getHTML()).toBe(`<${tag}>Legal</${tag}><p>Links</p>`);
  });

  it.each(['<h5 data-heading-variant="footer">Legal</h5>', '<h2 data-heading-variant="unknown">Legal</h2>'])(
    'should discard unsupported heading variants from %s',
    (html) => {
      createEditor(html);

      expect(editor.getHTML()).not.toContain('data-heading-variant');
    },
  );
});
