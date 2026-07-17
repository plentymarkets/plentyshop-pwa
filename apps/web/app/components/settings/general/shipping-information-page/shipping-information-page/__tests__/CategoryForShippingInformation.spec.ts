import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import CategoryForShippingInformation from '../CategoryForShippingInformation.vue';

const { useSiteSettingsMock, getEditorTranslationMock } = vi.hoisted(() => ({
  useSiteSettingsMock: vi.fn(),
  getEditorTranslationMock: vi.fn((key: string) => key),
}));

mockNuxtImport('useSiteSettings', () => useSiteSettingsMock);
mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

const EditorCategorySelectStub = defineComponent({
  name: 'EditorCategorySelect',
  props: {
    modelValue: { type: String, default: null },
    baseSearchParams: { type: Object, default: () => ({}) },
  },
  emits: ['update:modelValue'],
  template: '<div data-testid="category-select-stub" />',
});

const UiFormLabelStub = defineComponent({
  name: 'UiFormLabel',
  template: '<label><slot /></label>',
});

describe('CategoryForShippingInformation', () => {
  const updateSetting = vi.fn();
  const getSetting = vi.fn();

  const mountComponent = () =>
    mount(CategoryForShippingInformation, {
      global: {
        stubs: {
          EditorCategorySelect: EditorCategorySelectStub,
          UiFormLabel: UiFormLabelStub,
        },
      },
    });

  beforeEach(() => {
    vi.clearAllMocks();
    getSetting.mockReturnValue('42');
    useSiteSettingsMock.mockReturnValue({ updateSetting, getSetting });
  });

  it('should call useSiteSettings with shippingTextCategoryId', () => {
    mountComponent();
    expect(useSiteSettingsMock).toHaveBeenCalledWith('shippingTextCategoryId');
  });

  it('should render the description', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('description');
  });

  it('should render the label', () => {
    const wrapper = mountComponent();
    expect(wrapper.text()).toContain('label');
  });

  it('should NOT render a tooltip', () => {
    const wrapper = mountComponent();
    expect(wrapper.find('SfTooltip').exists()).toBe(false);
    expect(wrapper.find('SfIconInfo').exists()).toBe(false);
  });

  it('should render the category select', () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(EditorCategorySelectStub).exists()).toBe(true);
  });

  it('should pass the current setting value to the category select', () => {
    getSetting.mockReturnValue('99');
    const wrapper = mountComponent();
    expect(wrapper.findComponent(EditorCategorySelectStub).props('modelValue')).toBe('99');
  });

  it('should pass content type filter to category select', () => {
    const wrapper = mountComponent();
    expect(wrapper.findComponent(EditorCategorySelectStub).props('baseSearchParams')).toMatchObject({
      type: 'in:content',
    });
  });

  it('should call updateSetting with the new value when category select emits update', async () => {
    const wrapper = mountComponent();
    await wrapper.findComponent(EditorCategorySelectStub).vm.$emit('update:modelValue', '123');
    expect(updateSetting).toHaveBeenCalledWith('123');
  });

  it('should call updateSetting with empty string when null is emitted', async () => {
    const wrapper = mountComponent();
    await wrapper.findComponent(EditorCategorySelectStub).vm.$emit('update:modelValue', null);
    expect(updateSetting).toHaveBeenCalledWith('');
  });
});
