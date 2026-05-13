import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { Block } from '@plentymarkets/shop-api';
import { useQuickAdd } from '../useQuickAdd';

const mockInsertCustomBlock = vi.fn();
const mockGetBlockTemplateByLanguage = vi.fn();
const isEditingEnabled = ref(false);
const data = ref<Block[]>([]);
const cleanData = ref<Block[]>([]);

mockNuxtImport('useBlockManager', () => () => ({
  insertCustomBlock: mockInsertCustomBlock,
}));

mockNuxtImport('useBlocksList', () => () => ({
  getBlockTemplateByLanguage: mockGetBlockTemplateByLanguage,
}));

mockNuxtImport('useEditor', () => () => ({
  isEditingEnabled,
}));

mockNuxtImport('useBlocks', () => () => ({
  data,
  cleanData,
}));

mockNuxtImport('useNuxtApp', () => () => ({
  $i18n: { locale: ref('en') },
}));

mockNuxtImport('deepEqual', () => (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b));

const createBlock = (uuidValue: string, parentSlot?: number): Block =>
  ({
    meta: { uuid: uuidValue },
    parent_slot: parentSlot,
    content: [],
  }) as unknown as Block;

const createTemplateBlock = (): Block =>
  ({
    meta: { uuid: 'template-uuid' },
    content: [{ meta: { uuid: 'child-uuid' } }],
  }) as unknown as Block;

describe('useQuickAdd', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isEditingEnabled.value = false;
    data.value = [];
    cleanData.value = [];
    mockGetBlockTemplateByLanguage.mockResolvedValue(createTemplateBlock());
  });

  describe('quickAddBlock with default insert', () => {
    it('should call insertCustomBlock with the template and last child uuid', async () => {
      const lastChild = createBlock('last-child-uuid');
      const getLastChild = () => lastChild;

      const { quickAddBlock } = useQuickAdd(getLastChild);
      await quickAddBlock({ blockName: 'Image', label: 'Image', category: 'image', variationIndex: 0 });

      expect(mockGetBlockTemplateByLanguage).toHaveBeenCalledWith('image', 0, 'en');
      expect(mockInsertCustomBlock).toHaveBeenCalledWith(expect.any(Object), 'last-child-uuid', 'bottom');
    });

    it('should not insert if getLastChild returns undefined', async () => {
      const getLastChild = () => undefined;

      const { quickAddBlock } = useQuickAdd(getLastChild);
      await quickAddBlock({ blockName: 'Image', label: 'Image', category: 'image', variationIndex: 0 });

      expect(mockInsertCustomBlock).not.toHaveBeenCalled();
    });
  });

  describe('quickAddBlock with custom insert', () => {
    it('should call customInsert with a new uuid assigned', async () => {
      const customInsert = vi.fn();
      const getLastChild = () => undefined;

      const { quickAddBlock } = useQuickAdd(getLastChild, customInsert);
      await quickAddBlock({ blockName: 'TextCard', label: 'Rich Text', category: 'text', variationIndex: 0 });

      expect(customInsert).toHaveBeenCalledWith(expect.objectContaining({ meta: expect.any(Object) }));
      const insertedBlock = customInsert.mock.calls[0]![0] as Block;
      expect(insertedBlock.meta.uuid).not.toBe('template-uuid');
    });

    it('should assign new uuids to child blocks', async () => {
      const customInsert = vi.fn();
      const getLastChild = () => undefined;

      const { quickAddBlock } = useQuickAdd(getLastChild, customInsert);
      await quickAddBlock({ blockName: 'TextCard', label: 'Rich Text', category: 'text', variationIndex: 0 });

      const insertedBlock = customInsert.mock.calls[0]![0] as Block;
      const children = insertedBlock.content as Block[];
      expect(children[0]!.meta.uuid).not.toBe('child-uuid');
    });

    it('should set isEditingEnabled to true when data differs from cleanData', async () => {
      const customInsert = vi.fn().mockImplementation(() => {
        data.value = [createBlock('new-block')];
      });
      const getLastChild = () => undefined;

      const { quickAddBlock } = useQuickAdd(getLastChild, customInsert);
      await quickAddBlock({ blockName: 'Image', label: 'Image', category: 'image', variationIndex: 0 });

      expect(isEditingEnabled.value).toBe(true);
    });

    it('should not call insertCustomBlock when customInsert is provided', async () => {
      const customInsert = vi.fn();
      const getLastChild = () => undefined;

      const { quickAddBlock } = useQuickAdd(getLastChild, customInsert);
      await quickAddBlock({ blockName: 'Image', label: 'Image', category: 'image', variationIndex: 0 });

      expect(mockInsertCustomBlock).not.toHaveBeenCalled();
    });
  });
});
