import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import QuickAdd from '../QuickAdd.vue';
import type { QuickAddOption } from '../types';

mockNuxtImport('useRuntimeConfig', () => () => ({
  public: { enableQuickAdd: true },
}));

mockNuxtImport('getBlockIconSvg', () => (blockName: string) => {
  if (blockName === 'Image') return '<svg>icon</svg>';
  return null;
});

let emptyGridBlockCounter = 0;
mockNuxtImport('createEmptyGridBlock', () => (parentSlot: number) => ({
  name: 'EmptyGridBlock',
  type: 'content',
  content: [],
  meta: { uuid: `empty-grid-${emptyGridBlockCounter++}` },
  parent_slot: parentSlot,
}));

const mockAddNewBlock = vi.fn();
const mockFindOrDeleteBlockByUuid = vi.fn();
mockNuxtImport('useBlockManager', () => () => ({
  addNewBlock: mockAddNewBlock,
  findOrDeleteBlockByUuid: mockFindOrDeleteBlockByUuid,
}));

const mockBlockUuid = ref('parent-block-uuid');
mockNuxtImport('useSiteConfiguration', () => () => ({
  blockUuid: mockBlockUuid,
}));

const mockAllBlocks = ref([
  {
    meta: { uuid: 'parent-block-uuid' },
    content: [{ meta: { uuid: 'last-child-uuid' } }],
  },
]);
mockNuxtImport('useBlocks', () => () => ({
  allBlocks: mockAllBlocks,
}));

const options: QuickAddOption[] = [
  { blockName: 'Image', label: 'Image', category: 'image', variationIndex: 0 },
  { blockName: 'TextCard', label: 'Rich Text', category: 'text', variationIndex: 0 },
  { blockName: 'MultiGrid', label: 'Layout', category: 'layout', variationIndex: 0 },
];

const createWrapper = (props?: { options?: QuickAddOption[] }) => {
  return mount(QuickAdd, {
    props: {
      options,
      ...props,
    },
    global: {
      stubs: {
        NuxtImg: true,
      },
    },
  });
};

describe('QuickAdd', () => {
  beforeEach(() => {
    mockAddNewBlock.mockReset();
    mockFindOrDeleteBlockByUuid.mockReset();
    mockFindOrDeleteBlockByUuid.mockReturnValue({
      name: 'SomeBlock',
      content: [{ meta: { uuid: 'last-child-uuid' } }],
    });
    emptyGridBlockCounter = 0;
  });

  it('should render buttons for each option', () => {
    const wrapper = createWrapper();

    const buttons = wrapper.findAll('button');
    expect(buttons).toHaveLength(3);
  });

  it('should display option labels', () => {
    const wrapper = createWrapper();

    expect(wrapper.text()).toContain('Image');
    expect(wrapper.text()).toContain('Rich Text');
    expect(wrapper.text()).toContain('Layout');
  });

  it('should call addNewBlock with correct params when a button is clicked', async () => {
    const wrapper = createWrapper();

    await wrapper.find('[data-testid="quick-add-Image"]').trigger('click');

    expect(mockAddNewBlock).toHaveBeenCalledWith('image', 0, 'last-child-uuid', 'bottom');
  });

  it('should not call addNewBlock when block has no content', async () => {
    mockFindOrDeleteBlockByUuid.mockReturnValue({ content: [] });
    const wrapper = createWrapper();

    await wrapper.find('[data-testid="quick-add-Image"]').trigger('click');

    expect(mockAddNewBlock).not.toHaveBeenCalled();
  });

  it('should not call addNewBlock when block is not found', async () => {
    mockFindOrDeleteBlockByUuid.mockReturnValue(undefined);
    const wrapper = createWrapper();

    await wrapper.find('[data-testid="quick-add-Image"]').trigger('click');

    expect(mockAddNewBlock).not.toHaveBeenCalled();
  });

  it('should render inline SVG when getBlockIconSvg returns a value', () => {
    const wrapper = createWrapper();

    const imageButton = wrapper.find('[data-testid="quick-add-Image"]');
    expect(imageButton.find('span').html()).toContain('<svg>icon</svg>');
  });

  it('should render NuxtImg fallback when getBlockIconSvg returns null', () => {
    const wrapper = createWrapper();

    const textButton = wrapper.find('[data-testid="quick-add-TextCard"]');
    expect(textButton.find('nuxt-img-stub').exists()).toBe(true);
  });

  it('should not render when options array is empty', () => {
    const wrapper = createWrapper({ options: [] });

    expect(wrapper.find('div').exists()).toBe(false);
  });

  describe('MultiGrid behavior', () => {
    it('should always add a new col-12 row and insert the block', async () => {
      const multiGridBlock = {
        name: 'MultiGrid',
        configuration: { columnWidths: [6, 6] },
        content: [
          { name: 'ImageBlock', meta: { uuid: 'block-1' }, parent_slot: 0 },
          { name: 'TextCard', meta: { uuid: 'block-2' }, parent_slot: 1 },
        ],
      };
      mockFindOrDeleteBlockByUuid.mockReturnValue(multiGridBlock);
      const wrapper = createWrapper();

      await wrapper.find('[data-testid="quick-add-Image"]').trigger('click');

      expect(multiGridBlock.configuration.columnWidths).toEqual([6, 6, 12]);
      expect(multiGridBlock.content).toHaveLength(3);
      expect(multiGridBlock.content[2]!.name).toBe('EmptyGridBlock');
      expect(multiGridBlock.content[2]!.parent_slot).toBe(2);
      expect(mockAddNewBlock).toHaveBeenCalledWith('image', 0, multiGridBlock.content[2]!.meta.uuid, 'inside');
    });
  });
});
