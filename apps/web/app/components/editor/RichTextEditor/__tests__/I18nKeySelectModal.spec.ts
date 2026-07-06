import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import I18nKeySelectModal from '../I18nKeySelectModal.vue';

const { useI18nMock, useEditorLocalizationLocalesMock, useEditorLocalizationKeysMock, getEditorTranslationMock } =
  vi.hoisted(() => ({
    useI18nMock: vi.fn(),
    useEditorLocalizationLocalesMock: vi.fn(),
    useEditorLocalizationKeysMock: vi.fn(),
    getEditorTranslationMock: vi.fn(),
  }));

mockNuxtImport('useI18n', () => useI18nMock);
mockNuxtImport('useEditorLocalizationLocales', () => useEditorLocalizationLocalesMock);
mockNuxtImport('useEditorLocalizationKeys', () => useEditorLocalizationKeysMock);
mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

const keys = ref([
  {
    key: 'account.accountSettings.billingDetails.billingAddress',
    translations: {
      en: { input: 'Billing address', value: 'Billing address', isDeployed: true },
    },
  },
  {
    key: 'checkout.title',
    translations: {
      en: { input: 'Checkout', value: 'Checkout', isDeployed: true },
    },
  },
]);

const mountComponent = () =>
  mount(I18nKeySelectModal, {
    global: {
      stubs: {
        UiOverlay: { template: '<div><slot /></div>' },
        UiButton: { template: '<button type="button" @click="$emit(\'click\')"><slot /></button>' },
        SfModal: { template: '<div><slot /></div>' },
        SfInput: {
          props: ['modelValue'],
          template:
            '<div><input :id="$attrs.id" :value="modelValue" /><slot name="prefix" /><slot name="suffix" /></div>',
        },
        SfIconClose: true,
        SfIconSearch: true,
      },
    },
  });

const dispatchKeydown = async (key: string) => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
  await nextTick();
};

describe('I18nKeySelectModal keyboard support', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useI18nMock.mockReturnValue({ locale: ref('en') });
    useEditorLocalizationLocalesMock.mockReturnValue({ selectedLocales: ref(['en']), initializeLocales: vi.fn() });
    useEditorLocalizationKeysMock.mockReturnValue({
      keys,
      loading: ref(false),
      loadKeys: vi.fn(),
      drawerOpen: ref(false),
    });
    getEditorTranslationMock.mockImplementation((key: string) => key);
  });

  it('should move selection with arrow keys and insert the selected key with Enter', async () => {
    const wrapper = mountComponent();
    await nextTick();

    await dispatchKeydown('ArrowDown');
    await dispatchKeydown('Enter');

    expect(wrapper.emitted('insert')).toEqual([[{ key: 'checkout.title', label: 'checkout.title' }]]);
    expect(wrapper.emitted('close')).toHaveLength(1);

    wrapper.unmount();
  });

  it('should wrap selection upward and insert with Enter', async () => {
    const wrapper = mountComponent();
    await nextTick();

    await dispatchKeydown('ArrowUp');
    await dispatchKeydown('Enter');

    expect(wrapper.emitted('insert')).toEqual([[{ key: 'checkout.title', label: 'checkout.title' }]]);

    wrapper.unmount();
  });

  it('should close without inserting on Escape', async () => {
    const wrapper = mountComponent();
    await nextTick();

    await dispatchKeydown('Escape');

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('insert')).toBeUndefined();

    wrapper.unmount();
  });
});
