import { mount } from '@vue/test-utils';
import type { UtilityBarSection } from '~/components/blocks/UtilityBar/types';
import UtilityBarSectionsList from '../UtilityBarSectionsList.vue';

describe('UtilityBarSectionsList', () => {
  const sections: UtilityBarSection[] = [
    { id: 'logo', name: 'UtilityBarLogo', visible: true },
    { id: 'search', name: 'UtilityBarSearch', visible: false },
    { id: 'actions', name: 'UtilityBarActions', visible: true },
  ];

  const getSectionLabel = vi.fn((sectionId: string) => `${sectionId}-label`);
  const getEditorTranslation = vi.fn((key: string) => key);
  const editSection = vi.fn();
  const toggleSectionMenu = vi.fn();
  const toggleSectionVisibility = vi.fn();

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
      '<button data-testid="visibility-switch-stub" @click="$emit(\'update:model-value\', !modelValue)">{{ modelValue }}</button>',
  });

  const mountComponent = (
    overrides: Partial<{
      openSectionMenuIndex: number | undefined;
      currentEditingSectionIndex: number | undefined;
    }> = {},
  ) => {
    return mount(UtilityBarSectionsList, {
      props: {
        sections,
        openSectionMenuIndex: undefined,
        currentEditingSectionIndex: undefined,
        getSectionLabel,
        getEditorTranslation,
        editSection,
        toggleSectionMenu,
        toggleSectionVisibility,
        ...overrides,
      },
      global: {
        stubs: {
          UiAccordionItem: {
            template: '<div><slot name="summary" /><slot /></div>',
          },
          UiFormLabel: {
            template: '<label><slot /></label>',
          },
          SfSwitch: SfSwitchStub,
          SfIconMoreVert: true,
          SfIconBase: true,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all section labels from getSectionLabel', () => {
    const wrapper = mountComponent();

    const labelTexts = wrapper.findAll('span.text-sm.font-medium').map((item) => item.text());

    expect(labelTexts).toEqual(['logo-label', 'search-label', 'actions-label']);
    expect(getSectionLabel).toHaveBeenCalledTimes(3);
  });

  it('should call editSection and toggleSectionMenu with matching indices', async () => {
    const wrapper = mountComponent();

    await wrapper.getByTestId('actions-edit-section-1').trigger('click');
    await wrapper.getByTestId('actions-menu-section-2').trigger('click');

    expect(editSection).toHaveBeenCalledWith(1);
    expect(toggleSectionMenu).toHaveBeenCalledWith(2);
  });

  it('should render visibility menu for open section and toggle visibility handler', async () => {
    const wrapper = mountComponent({ openSectionMenuIndex: 1 });

    const visibilityToggle = wrapper.getByTestId('actions-toggle-visibility-section-1');
    await visibilityToggle.trigger('click');

    expect(toggleSectionVisibility).toHaveBeenCalledWith(1);
  });
});
