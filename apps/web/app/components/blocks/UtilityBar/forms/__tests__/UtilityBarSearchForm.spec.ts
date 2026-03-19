import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { UtilityBarContent } from '~/components/blocks/UtilityBar/types';
import UtilityBarSearchForm from '../UtilityBarSearchForm.vue';

const { useUtilityBarStateMock, getEditorTranslationMock } = vi.hoisted(() => {
  return {
    useUtilityBarStateMock: vi.fn(),
    getEditorTranslationMock: vi.fn((key: string) => key),
  };
});

mockNuxtImport('useUtilityBarState', () => useUtilityBarStateMock);
mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

const createContent = (displayMode: 'full' | 'icon-only' = 'full'): UtilityBarContent => ({
  layout: { paddingTop: 20, paddingBottom: 20, paddingLeft: 40, paddingRight: 40 },
  sectionOrder: { sections: ['logo', 'search', 'actions'] },
  sectionVisibility: { logo: true, search: true, actions: true },
  color: { iconColor: '#fff', backgroundColor: 'rgb(var(--colors-2-primary-500))' },
  logo: { logo: '' },
  search: { displayMode },
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

describe('UtilityBarSearchForm', () => {
  const content = ref<UtilityBarContent>(createContent('full'));

  const SfSwitchStub = defineComponent({
    name: 'SfSwitch',
    props: {
      modelValue: {
        type: Boolean,
        required: true,
      },
    },
    emits: ['update:model-value'],
    template:
      '<button data-testid="search-switch-stub" @click="$emit(\'update:model-value\', !modelValue)">{{ modelValue }}</button>',
  });

  beforeEach(() => {
    vi.clearAllMocks();
    content.value = createContent('full');

    useUtilityBarStateMock.mockReturnValue({
      content,
    });
  });

  it('should render search settings and initialize switch as false in full mode', () => {
    const wrapper = mount(UtilityBarSearchForm, {
      props: { uuid: 'utility-search-form-uuid' },
      global: {
        stubs: {
          UiAccordionItem: {
            template: '<div><slot name="summary" /><slot /></div>',
          },
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          SfSwitch: SfSwitchStub,
        },
      },
    });

    expect(wrapper.text()).toContain('search-section-label');
    expect(wrapper.text()).toContain('icon-only-label');
    expect(wrapper.getByTestId('search-switch-stub').text()).toBe('false');
  });

  it('should switch from full mode to icon-only mode', async () => {
    const wrapper = mount(UtilityBarSearchForm, {
      props: { uuid: 'utility-search-form-uuid' },
      global: {
        stubs: {
          UiAccordionItem: {
            template: '<div><slot name="summary" /><slot /></div>',
          },
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          SfSwitch: SfSwitchStub,
        },
      },
    });

    await wrapper.getByTestId('search-switch-stub').trigger('click');

    expect(content.value.search.displayMode).toBe('icon-only');
  });

  it('should switch from icon-only mode to full mode', async () => {
    content.value = createContent('icon-only');

    const wrapper = mount(UtilityBarSearchForm, {
      props: { uuid: 'utility-search-form-uuid' },
      global: {
        stubs: {
          UiAccordionItem: {
            template: '<div><slot name="summary" /><slot /></div>',
          },
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          SfSwitch: SfSwitchStub,
        },
      },
    });

    await wrapper.getByTestId('search-switch-stub').trigger('click');

    expect(content.value.search.displayMode).toBe('full');
  });
});
