import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { UtilityBarContent } from '~/components/blocks/UtilityBar/types';
import UtilityBarLayoutSettings from '../UtilityBarLayoutSettings.vue';

const { useUtilityBarStateMock, getEditorTranslationMock } = vi.hoisted(() => {
  return {
    useUtilityBarStateMock: vi.fn(),
    getEditorTranslationMock: vi.fn((key: string) => key),
  };
});

mockNuxtImport('useUtilityBarState', () => useUtilityBarStateMock);
mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

const createContent = (): UtilityBarContent => ({
  layout: {
    paddingTop: 20,
    paddingBottom: 21,
    paddingLeft: 22,
    paddingRight: 23,
  },
  sectionOrder: { sections: ['logo', 'search', 'actions'] },
  sectionVisibility: { logo: true, search: true, actions: true },
  color: {
    iconColor: '#ffffff',
    backgroundColor: '#101010',
  },
  logo: { logo: '' },
  search: { displayMode: 'full' },
  actions: {
    order: ['language', 'wishlist', 'cart', 'account'],
    visibility: {
      language: true,
      wishlist: true,
      cart: true,
      account: true,
    },
  },
});

describe('UtilityBarLayoutSettings', () => {
  const content = ref<UtilityBarContent>(createContent());

  const UiAccordionItemStub = defineComponent({
    name: 'UiAccordionItem',
    props: {
      modelValue: {
        type: Boolean,
        required: false,
        default: true,
      },
    },
    emits: ['update:modelValue'],
    template: '<div><slot name="summary" /><slot /></div>',
  });

  const EditorColorPickerStub = defineComponent({
    name: 'EditorColorPicker',
    props: {
      modelValue: {
        type: String,
        required: false,
        default: '',
      },
    },
    emits: ['update:modelValue'],
    methods: {
      toggle() {
        return;
      },
    },
    template: '<div><slot name="trigger" :color="modelValue" :toggle="toggle" /><slot /></div>',
  });

  const SfInputStub = defineComponent({
    name: 'SfInput',
    props: {
      modelValue: {
        type: String,
        required: false,
        default: '',
      },
      type: {
        type: String,
        required: false,
        default: 'text',
      },
    },
    emits: ['update:modelValue', 'click'],
    template:
      '<div><input data-testid="sf-input-stub" :value="modelValue" :type="type" @input="$emit(\'update:modelValue\', $event.target.value)" @click="$emit(\'click\')" /><slot name="suffix" /></div>',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    content.value = createContent();

    useUtilityBarStateMock.mockReturnValue({
      content,
    });
  });

  it('should render translated title and initial padding values', () => {
    const wrapper = mount(UtilityBarLayoutSettings, {
      props: { uuid: 'utility-layout-uuid' },
      global: {
        stubs: {
          UiAccordionItem: UiAccordionItemStub,
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          EditorColorPicker: EditorColorPickerStub,
          SfInput: SfInputStub,
          SfIconArrowDownward: true,
          SfIconArrowUpward: true,
          SfIconArrowBack: true,
          SfIconArrowForward: true,
        },
      },
    });

    expect(wrapper.getByTestId('utility-bar-layout-title').text()).toBe('layout-label');
    expect((wrapper.getByTestId('padding-top').element as HTMLInputElement).value).toBe('20');
    expect((wrapper.getByTestId('padding-bottom').element as HTMLInputElement).value).toBe('21');
    expect((wrapper.getByTestId('padding-left').element as HTMLInputElement).value).toBe('22');
    expect((wrapper.getByTestId('padding-right').element as HTMLInputElement).value).toBe('23');
  });

  it('should update layout paddings when number inputs change', async () => {
    const wrapper = mount(UtilityBarLayoutSettings, {
      props: { uuid: 'utility-layout-uuid' },
      global: {
        stubs: {
          UiAccordionItem: UiAccordionItemStub,
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          EditorColorPicker: EditorColorPickerStub,
          SfInput: SfInputStub,
          SfIconArrowDownward: true,
          SfIconArrowUpward: true,
          SfIconArrowBack: true,
          SfIconArrowForward: true,
        },
      },
    });

    await wrapper.getByTestId('padding-top').setValue('30');
    await wrapper.getByTestId('padding-bottom').setValue('31');
    await wrapper.getByTestId('padding-left').setValue('32');
    await wrapper.getByTestId('padding-right').setValue('33');

    expect(content.value.layout.paddingTop).toBe(30);
    expect(content.value.layout.paddingBottom).toBe(31);
    expect(content.value.layout.paddingLeft).toBe(32);
    expect(content.value.layout.paddingRight).toBe(33);
  });

  it('should update background and icon colors when SfInput values change', async () => {
    const wrapper = mount(UtilityBarLayoutSettings, {
      props: { uuid: 'utility-layout-uuid' },
      global: {
        stubs: {
          UiAccordionItem: UiAccordionItemStub,
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          EditorColorPicker: EditorColorPickerStub,
          SfInput: SfInputStub,
          SfIconArrowDownward: true,
          SfIconArrowUpward: true,
          SfIconArrowBack: true,
          SfIconArrowForward: true,
        },
      },
    });

    const inputs = wrapper.findAll('[data-testid="sf-input-stub"]');
    const backgroundInput = inputs[0];
    const iconInput = inputs[1];

    expect(backgroundInput).toBeDefined();
    expect(iconInput).toBeDefined();

    await backgroundInput!.setValue('#202020');
    await iconInput!.setValue('#fafafa');

    expect(content.value.color.backgroundColor).toBe('#202020');
    expect(content.value.color.iconColor).toBe('#fafafa');
  });
});
