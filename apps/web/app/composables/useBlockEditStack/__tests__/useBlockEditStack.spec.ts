import { describe, it, expect, beforeEach } from 'vitest';
import type { Block } from '@plentymarkets/shop-api';

const makeBlock = (uuid: string, name: string): Block =>
  ({
    name,
    type: 'structure',
    content: [],
    configuration: {},
    meta: { uuid },
  }) as unknown as Block;

const FOOTER_UUID = 'footer-uuid';
const LAYOUT_UUID = 'layout-uuid';
const RICHTEXT_UUID = 'richtext-uuid';

const layoutBlock = makeBlock(LAYOUT_UUID, 'MultiGrid');
const richTextBlock = makeBlock(RICHTEXT_UUID, 'TextCard');

describe('useBlockEditStack', () => {
  beforeEach(() => {
    const { clearStack, clearPendingEditChain } = useBlockEditStack();
    clearStack();
    clearPendingEditChain();
  });

  describe('footer → Layout → Rich Text navigation', () => {
    it('starts with an empty stack and no edit title', () => {
      const { stack } = useBlockEditStack();
      const { editTitle } = useBlockEditTitle();

      expect(stack.value).toEqual([]);
      expect(editTitle.value).toBeNull();
    });

    it('pushing the Layout block surfaces it as the footer-form child', () => {
      const { pushEdit, nextEditBlock } = useBlockEditStack();
      const { editTitle, editUuid } = useBlockEditTitle();

      const footerChild = nextEditBlock(ref(FOOTER_UUID));
      const layoutChild = nextEditBlock(ref(LAYOUT_UUID));

      pushEdit(layoutBlock);

      expect(footerChild.value).toMatchObject({ meta: { uuid: LAYOUT_UUID } });
      expect(layoutChild.value).toBeNull();
      expect(editTitle.value).toBe('Layout');
      expect(editUuid.value).toBe(LAYOUT_UUID);
    });

    it('pushing Rich Text on top keeps Layout as the footer child and surfaces Rich Text inside Layout', () => {
      const { pushEdit, nextEditBlock } = useBlockEditStack();
      const { editTitle, editUuid } = useBlockEditTitle();

      const footerChild = nextEditBlock(ref(FOOTER_UUID));
      const layoutChild = nextEditBlock(ref(LAYOUT_UUID));

      pushEdit(layoutBlock);
      pushEdit(richTextBlock);

      expect(footerChild.value).toMatchObject({ meta: { uuid: LAYOUT_UUID } });
      expect(layoutChild.value).toMatchObject({ meta: { uuid: RICHTEXT_UUID } });
      expect(editTitle.value).toBe('Rich Text');
      expect(editUuid.value).toBe(RICHTEXT_UUID);
    });

    it('popping from Rich Text returns to the Layout edit view, not to the footer root', () => {
      const { pushEdit, popEdit, nextEditBlock } = useBlockEditStack();
      const { editTitle, editUuid } = useBlockEditTitle();

      const footerChild = nextEditBlock(ref(FOOTER_UUID));
      const layoutChild = nextEditBlock(ref(LAYOUT_UUID));

      pushEdit(layoutBlock);
      pushEdit(richTextBlock);

      const popped = popEdit();

      expect(popped).toBe(true);
      expect(footerChild.value).toMatchObject({ meta: { uuid: LAYOUT_UUID } });
      expect(layoutChild.value).toBeNull();
      expect(editTitle.value).toBe('Layout');
      expect(editUuid.value).toBe(LAYOUT_UUID);
    });

    it('popping a second time returns to the footer root', () => {
      const { pushEdit, popEdit, nextEditBlock } = useBlockEditStack();
      const { editTitle, editUuid } = useBlockEditTitle();

      const footerChild = nextEditBlock(ref(FOOTER_UUID));

      pushEdit(layoutBlock);
      pushEdit(richTextBlock);
      popEdit();
      popEdit();

      expect(footerChild.value).toBeNull();
      expect(editTitle.value).toBeNull();
      expect(editUuid.value).toBeNull();
    });

    it('popping an empty stack is a no-op and returns false', () => {
      const { popEdit, stack } = useBlockEditStack();

      const popped = popEdit();

      expect(popped).toBe(false);
      expect(stack.value).toEqual([]);
    });
  });

  describe('nextEditBlock', () => {
    it('returns stack[0] when no parent uuid is supplied (top-level form case)', () => {
      const { pushEdit, nextEditBlock } = useBlockEditStack();
      const topLevelChild = nextEditBlock(ref(undefined));

      expect(topLevelChild.value).toBeNull();
      pushEdit(layoutBlock);
      expect(topLevelChild.value).toMatchObject({ meta: { uuid: LAYOUT_UUID } });
    });

    it('returns null when the parent uuid is on the stack but has no child', () => {
      const { pushEdit, nextEditBlock } = useBlockEditStack();
      pushEdit(layoutBlock);

      expect(nextEditBlock(ref(LAYOUT_UUID)).value).toBeNull();
    });

    it('accepts a plain string and resolves the next block in the stack', () => {
      const { pushEdit, nextEditBlock } = useBlockEditStack();
      pushEdit(layoutBlock);
      pushEdit(richTextBlock);

      expect(nextEditBlock(LAYOUT_UUID).value).toMatchObject({ meta: { uuid: RICHTEXT_UUID } });
    });

    it('reacts to a changing parent uuid ref', async () => {
      const { pushEdit, nextEditBlock } = useBlockEditStack();
      pushEdit(layoutBlock);
      pushEdit(richTextBlock);

      const parentUuid = ref<string | undefined>(FOOTER_UUID);
      const child = nextEditBlock(parentUuid);

      expect(child.value).toMatchObject({ meta: { uuid: LAYOUT_UUID } });

      parentUuid.value = LAYOUT_UUID;
      await nextTick();

      expect(child.value).toMatchObject({ meta: { uuid: RICHTEXT_UUID } });
    });
  });

  describe('clearStack', () => {
    it('empties the stack and clears the edit title in one shot', () => {
      const { pushEdit, clearStack, stack } = useBlockEditStack();
      const { editTitle, editUuid } = useBlockEditTitle();

      pushEdit(layoutBlock);
      pushEdit(richTextBlock);

      clearStack();

      expect(stack.value).toEqual([]);
      expect(editTitle.value).toBeNull();
      expect(editUuid.value).toBeNull();
    });
  });

  describe('clearPendingEditChain', () => {
    it('drops a pending chain so a later consume cannot apply it', () => {
      const { setPendingEditChain, clearPendingEditChain, consumePendingEditChain, stack } = useBlockEditStack();

      setPendingEditChain([layoutBlock, richTextBlock]);
      clearPendingEditChain();
      consumePendingEditChain();

      expect(stack.value).toEqual([]);
    });
  });
});
