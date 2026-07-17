import { mount } from '@vue/test-utils';
import { UiPurchaseCard } from '#components';
import type { ReviewCounts } from '@plentymarkets/shop-api';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { ProductMock } from '../../../../../__tests__/__mocks__/product.mock';
import type { PriceCardContent, PriceCardTextBlockItem, PriceCardOrderItem } from '../types';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  onBeforeRouteLeave: vi.fn(),
}));

mockNuxtImport('useTableOfContents', () => () => ({
  scrollToBlock: vi.fn(),
  selectedUuid: ref(''),
  hoveredUuid: ref(''),
  expandedBlocks: ref(new Set()),
  filters: ref(new Set()),
  data: ref([]),
  flatBlocks: ref([]),
  isStructureBlock: vi.fn().mockReturnValue(false),
  toggleBlockExpansion: vi.fn(),
  getChildren: vi.fn().mockReturnValue([]),
  editBlock: vi.fn(),
  replaceEmptyBlock: vi.fn(),
  addBlockAtBottom: vi.fn(),
  addBlockAtContainerEnd: vi.fn(),
  addBlockAtContainerStart: vi.fn(),
  addAtTopForSection: vi.fn(),
  addAtBottomForSection: vi.fn(),
  handleSectionDragChange: vi.fn(),
  blockToFlatBlock: vi.fn(),
  setHoveredBlock: vi.fn(),
  clearHoveredBlock: vi.fn(),
}));

const createTextBlock = (overrides?: Partial<PriceCardTextBlockItem>): PriceCardTextBlockItem => ({
  type: 'textBlock',
  uuid: 'text-block-uuid-1',
  content: '<p>Rich text content</p>',
  visible: true,
  ...overrides,
});

const createConfiguration = (extraFields: Partial<PriceCardContent> = {}): PriceCardContent => ({
  fields: {
    itemName: false,
    price: false,
    tags: false,
    availability: false,
    starRating: false,
    variationProperties: false,
    orderProperties: false,
    previewText: false,
    attributes: false,
    itemBundle: false,
    graduatedPrices: false,
    addToWishlist: false,
    quantityAndAddToCart: false,
    itemText: false,
    technicalData: false,
  },
  fieldsOrder: [] as PriceCardOrderItem[],
  fieldsDisabled: [],
  wishlistSize: 'small',
  dropShadow: false,
  borders: false,
  borderColor: '#000000',
  layout: { paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0, fullWidth: false },
  ...extraFields,
});

const globalStubs = {
  PayPalExpressButton: true,
  PayPalPayLaterBanner: true,
  UnitContentSelect: true,
};

describe('<PurchaseCard />', () => {
  it('should render component', () => {
    const wrapper = mount(UiPurchaseCard, {
      props: {
        product: ProductMock,
        reviewAverage: {} as ReviewCounts,
      },
      global: {
        stubs: globalStubs,
      },
    });

    expect(wrapper.getByTestId('purchase-card'));
  });

  describe('text block rendering', () => {
    beforeEach(() => {
      useState<string>('toc-highlighted-uuid').value = '';
    });

    it('should render a visible text block with its HTML content', () => {
      const textBlock = createTextBlock({ content: '<p>Rich text content</p>' });
      const wrapper = mount(UiPurchaseCard, {
        props: {
          product: ProductMock,
          configuration: createConfiguration({ fieldsOrder: [textBlock] }),
        },
        global: { stubs: globalStubs },
      });

      const rendered = wrapper.find(`[data-uuid="${textBlock.uuid}"]`);
      expect(rendered.exists()).toBe(true);
      expect(rendered.html()).toContain('Rich text content');
    });

    it('should not render a text block that has visible set to false', () => {
      const textBlock = createTextBlock({ visible: false });
      const wrapper = mount(UiPurchaseCard, {
        props: {
          product: ProductMock,
          configuration: createConfiguration({ fieldsOrder: [textBlock] }),
        },
        global: { stubs: globalStubs },
      });

      expect(wrapper.find(`[data-uuid="${textBlock.uuid}"]`).exists()).toBe(false);
    });

    it('should render multiple visible text blocks in fieldsOrder sequence', () => {
      const block1 = createTextBlock({ uuid: 'tb-1', content: '<p>First</p>' });
      const block2 = createTextBlock({ uuid: 'tb-2', content: '<p>Second</p>' });
      const wrapper = mount(UiPurchaseCard, {
        props: {
          product: ProductMock,
          configuration: createConfiguration({ fieldsOrder: [block1, block2] }),
        },
        global: { stubs: globalStubs },
      });

      expect(wrapper.find('[data-uuid="tb-1"]').exists()).toBe(true);
      expect(wrapper.find('[data-uuid="tb-2"]').exists()).toBe(true);
    });
    it('should apply the blue highlight ring class when highlightedUuid matches the text block uuid', async () => {
      const textBlock = createTextBlock();
      const tocHighlightedUuid = useState<string>('toc-highlighted-uuid');

      const wrapper = mount(UiPurchaseCard, {
        props: {
          product: ProductMock,
          configuration: createConfiguration({ fieldsOrder: [textBlock] }),
        },
        global: { stubs: globalStubs },
      });

      tocHighlightedUuid.value = textBlock.uuid;
      await nextTick();

      const el = wrapper.find(`[data-uuid="${textBlock.uuid}"]`);

      expect(el.classes()).toContain('ring-2');
      expect(el.classes()).toContain('ring-blue-500');
    });
    it('should not apply the highlight ring when highlightedUuid does not match', () => {
      const textBlock = createTextBlock();

      const tocHighlightedUuid = useState<string>('toc-highlighted-uuid');
      tocHighlightedUuid.value = 'other-uuid';

      const wrapper = mount(UiPurchaseCard, {
        props: {
          product: ProductMock,
          configuration: createConfiguration({ fieldsOrder: [textBlock] }),
        },
        global: { stubs: globalStubs },
      });

      const el = wrapper.find(`[data-uuid="${textBlock.uuid}"]`);
      expect(el.classes()).not.toContain('ring-2');
    });

    it('should set the data-uuid attribute on the rendered text block element', () => {
      const textBlock = createTextBlock({ uuid: 'my-text-block' });
      const wrapper = mount(UiPurchaseCard, {
        props: {
          product: ProductMock,
          configuration: createConfiguration({ fieldsOrder: [textBlock] }),
        },
        global: { stubs: globalStubs },
      });

      expect(wrapper.find('[data-uuid="my-text-block"]').exists()).toBe(true);
    });
  });
});
