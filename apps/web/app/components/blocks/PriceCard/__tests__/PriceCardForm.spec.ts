import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import PriceCardForm from '../PriceCardForm.vue';
import type { PriceCardContent, PriceCardTextBlockItem, PriceCardOrderItem } from '~/components/ui/PurchaseCard/types';

vi.mock('uuid', () => ({ v4: () => 'test-uuid-123' }));

const { getEditorTranslationMock } = vi.hoisted(() => ({
  getEditorTranslationMock: vi.fn((key: string) => key),
}));

mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

const allBlocks = ref([]);
const blockUuid = ref('block-uuid');
const scrollToBlock = vi.fn();
const findOrDeleteBlockByUuid = vi.fn();

mockNuxtImport('useBlocks', () => () => ({ allBlocks }));
mockNuxtImport('useSiteConfiguration', () => () => ({ blockUuid }));
mockNuxtImport('useBlockManager', () => () => ({ findOrDeleteBlockByUuid }));
mockNuxtImport('useTableOfContents', () => () => ({ scrollToBlock }));
mockNuxtImport('useFullWidthToggleForContent', () => () => ({ isFullWidth: ref(false) }));
mockNuxtImport('useSiteSettings', () => () => ({ getSetting: vi.fn(() => '0') }));
mockNuxtImport('useEditorOptionsTabs', () => () => ({
  wishlistSizeModel: ref('small'),
  wishlistSizeOptions: ref([]),
}));

const createContent = (): PriceCardContent => ({
  fields: {
    itemName: true,
    price: true,
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
  fieldsOrder: ['itemName', 'price'] as PriceCardOrderItem[],
  fieldsDisabled: [],
  wishlistSize: 'small',
  dropShadow: false,
  borders: false,
  borderColor: '#000000',
  layout: { paddingTop: 0, paddingBottom: 0, paddingRight: 0, paddingLeft: 0, fullWidth: false },
});

const createTextBlock = (overrides?: Partial<PriceCardTextBlockItem>): PriceCardTextBlockItem => ({
  type: 'textBlock',
  uuid: 'tb-uuid-1',
  content: '<p>Hello world</p>',
  visible: true,
  ...overrides,
});

const DraggableStub = defineComponent({
  name: 'draggable',
  props: {
    modelValue: { type: Array, required: true },
    itemKey: { type: [String, Function] },
    filter: String,
    handle: String,
  },
  emits: ['update:modelValue'],
  template:
    '<div data-testid="draggable-stub"><slot name="item" v-for="(element, index) in modelValue" :element="element" :index="index" /></div>',
});

const SfSwitchStub = defineComponent({
  name: 'SfSwitch',
  props: { modelValue: { type: Boolean, default: false } },
  emits: ['update:model-value'],
  template:
    '<button data-testid="switch-stub" @click="$emit(\'update:model-value\', !modelValue)">{{ modelValue }}</button>',
});

const RteFormStub = defineComponent({
  name: 'EditorRichTextEditorForm',
  props: { modelValue: String },
  emits: ['update:modelValue'],
  template:
    '<div data-testid="rte-form-stub"><button data-testid="rte-emit-btn" @click="$emit(\'update:modelValue\', \'<p>Updated</p>\')">emit</button></div>',
});

const globalStubs = {
  EditorFormPanel: { template: '<div><slot /></div>' },
  EditorOptionsTabs: true,
  EditorFullWidthToggle: true,
  EditorColorPicker: { template: '<div><slot name="trigger" :color="\'#fff\'" :toggle="() => {}" /></div>' },
  SfInput: { template: '<div><slot name="suffix" /></div>' },
  UiFormLabel: { template: '<label><slot /></label>' },
  draggable: DraggableStub,
  SfSwitch: SfSwitchStub,
  EditorRichTextEditorForm: RteFormStub,
  SfIconBase: true,
  SfIconDelete: true,
  SfIconAdd: true,
  SfIconInfo: true,
  SfTooltip: true,
  SfIconArrowUpward: true,
  SfIconArrowDownward: true,
  SfIconArrowForward: true,
  SfIconArrowBack: true,
};

describe('PriceCardForm', () => {
  let content: PriceCardContent;

  const mountForm = () =>
    mount(PriceCardForm, {
      global: { stubs: globalStubs },
    });

  beforeEach(() => {
    vi.clearAllMocks();
    content = reactive(createContent());
    findOrDeleteBlockByUuid.mockReturnValue({ content });
  });

  describe('add text block button', () => {
    it('should render the "Add text and item data" button', () => {
      const wrapper = mountForm();
      expect(wrapper.getByTestId('actions-add-text-block-button')).toBeTruthy();
    });

    it('should add a text block to fieldsOrder when the add button is clicked', async () => {
      const wrapper = mountForm();

      await wrapper.getByTestId('actions-add-text-block-button').trigger('click');

      expect(content.fieldsOrder).toHaveLength(3);
      const added = content.fieldsOrder[2] as PriceCardTextBlockItem;
      expect(added.type).toBe('textBlock');
      expect(added.uuid).toBe('test-uuid-123');
      expect(added.content).toBe('');
      expect(added.visible).toBe(true);
    });
  });

  describe('text block row rendering', () => {
    beforeEach(() => {
      content.fieldsOrder = [...content.fieldsOrder, createTextBlock()];
    });

    it('should render the edit button for a text block', () => {
      const wrapper = mountForm();
      expect(wrapper.getByTestId('price-card-edit-textblock-tb-uuid-1')).toBeTruthy();
    });

    it('should render the delete button for a text block', () => {
      const wrapper = mountForm();
      expect(wrapper.getByTestId('price-card-delete-textblock-tb-uuid-1')).toBeTruthy();
    });

    it('should render the visibility switch for a text block', () => {
      const wrapper = mountForm();
      expect(wrapper.getByTestId('price-card-visible-textblock-tb-uuid-1')).toBeTruthy();
    });

    it('should not render the RTE editor initially', () => {
      const wrapper = mountForm();
      expect(wrapper.findByTestId('rte-form-stub').exists()).toBe(false);
    });
  });

  describe('edit (pencil) button', () => {
    beforeEach(() => {
      content.fieldsOrder = [...content.fieldsOrder, createTextBlock()];
    });

    it('should show the inline RTE when the edit button is clicked', async () => {
      const wrapper = mountForm();

      await wrapper.getByTestId('price-card-edit-textblock-tb-uuid-1').trigger('click');
      await nextTick();

      expect(wrapper.findByTestId('rte-form-stub').exists()).toBe(true);
    });

    it('should hide the inline RTE when the edit button is clicked a second time', async () => {
      const wrapper = mountForm();
      const editBtn = wrapper.getByTestId('price-card-edit-textblock-tb-uuid-1');

      await editBtn.trigger('click');
      await nextTick();
      await editBtn.trigger('click');
      await nextTick();

      expect(wrapper.findByTestId('rte-form-stub').exists()).toBe(false);
    });

    it('should call scrollToBlock with the text block uuid when the edit button is clicked', async () => {
      const wrapper = mountForm();

      await wrapper.getByTestId('price-card-edit-textblock-tb-uuid-1').trigger('click');

      expect(scrollToBlock).toHaveBeenCalledWith('tb-uuid-1');
    });
  });

  describe('delete button', () => {
    beforeEach(() => {
      content.fieldsOrder = [...content.fieldsOrder, createTextBlock()];
    });

    it('should remove the text block from fieldsOrder when delete is clicked', async () => {
      const wrapper = mountForm();

      await wrapper.getByTestId('price-card-delete-textblock-tb-uuid-1').trigger('click');

      expect(content.fieldsOrder).toHaveLength(2);
      expect(
        content.fieldsOrder.every((f) => typeof f !== 'object' || (f as PriceCardTextBlockItem).uuid !== 'tb-uuid-1'),
      ).toBe(true);
    });

    it('should close the RTE when the open text block is deleted', async () => {
      const wrapper = mountForm();

      await wrapper.getByTestId('price-card-edit-textblock-tb-uuid-1').trigger('click');
      await nextTick();
      await wrapper.getByTestId('price-card-delete-textblock-tb-uuid-1').trigger('click');
      await nextTick();

      expect(wrapper.findByTestId('rte-form-stub').exists()).toBe(false);
    });
  });

  describe('visibility toggle', () => {
    beforeEach(() => {
      content.fieldsOrder = [...content.fieldsOrder, createTextBlock({ visible: true })];
    });

    it('should update the text block visible property when the switch is toggled', async () => {
      const wrapper = mountForm();

      await wrapper.getByTestId('price-card-visible-textblock-tb-uuid-1').trigger('click');

      const textBlock = content.fieldsOrder.find(
        (field): field is PriceCardTextBlockItem =>
          typeof field === 'object' && (field as PriceCardTextBlockItem).uuid === 'tb-uuid-1',
      );
      expect(textBlock?.visible).toBe(false);
    });
  });

  describe('content update', () => {
    beforeEach(() => {
      content.fieldsOrder = [...content.fieldsOrder, createTextBlock({ content: '' })];
    });

    it('should update the text block content when the RTE emits a new value', async () => {
      const wrapper = mountForm();

      await wrapper.getByTestId('price-card-edit-textblock-tb-uuid-1').trigger('click');
      await nextTick();
      await wrapper.getByTestId('rte-emit-btn').trigger('click');
      await nextTick();

      const textBlock = content.fieldsOrder.find(
        (field): field is PriceCardTextBlockItem =>
          typeof field === 'object' && (field as PriceCardTextBlockItem).uuid === 'tb-uuid-1',
      );
      expect(textBlock?.content).toBe('<p>Updated</p>');
    });
  });
});
