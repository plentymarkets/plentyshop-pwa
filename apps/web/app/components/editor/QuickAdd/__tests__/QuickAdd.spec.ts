import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import QuickAdd from '../QuickAdd.vue';
import type { QuickAddOption } from '../types';
import type { Block } from '@plentymarkets/shop-api';

mockNuxtImport('useRuntimeConfig', () => () => ({
  public: { enableQuickAdd: true },
}));

mockNuxtImport('getBlockIconSvg', () => (blockName: string) => {
  if (blockName === 'Image') return '<svg>icon</svg>';
  return null;
});

const mockAddNewBlock = vi.fn();
mockNuxtImport('useBlockManager', () => () => ({
  addNewBlock: mockAddNewBlock,
}));

const options: QuickAddOption[] = [
  { blockName: 'Image', label: 'Image', category: 'image', variationIndex: 0 },
  { blockName: 'TextCard', label: 'Rich Text', category: 'text', variationIndex: 0 },
  { blockName: 'MultiGrid', label: 'Layout', category: 'layout', variationIndex: 0 },
];

const mockLastChild = { meta: { uuid: 'last-child-uuid' } } as unknown as Block;
const getLastChild = () => mockLastChild;

const createWrapper = (props?: { options?: QuickAddOption[]; getLastChild?: () => Block | undefined }) => {
  return mount(QuickAdd, {
    props: {
      options,
      getLastChild,
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

  it('should not call addNewBlock when getLastChild returns undefined', async () => {
    const wrapper = createWrapper({ getLastChild: () => undefined });

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
});
