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

  const DraggableStub = defineComponent({
    name: 'draggable',
    props: {
      modelValue: {
        type: Array,
        required: true,
      },
    },
    emits: ['update:model-value'],
    template:
      '<div data-testid="draggable-stub"><slot name="item" v-for="(element, index) in modelValue" :element="element" :index="index" :key="element.id" /></div>',
  });

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
          EditorFormPanel: {
            template: '<div><slot /></div>',
          },
          draggable: DraggableStub,
          SfSwitch: SfSwitchStub,
          SfIconMenu: true,
          SfIconBase: true,
          SfIconMoreVert: true,
          SfIconVisibilityOff: true,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all section labels from getSectionLabel', () => {
    const wrapper = mountComponent();

    const labelTexts = wrapper.findAll('span.text-xs.truncate').map((item) => item.text());

    expect(labelTexts).toEqual(['logo-label', 'search-label', 'actions-label']);
    expect(getSectionLabel).toHaveBeenCalledTimes(3);
  });

  it('should call editSection with the correct index when edit button is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.getByTestId('actions-edit-section-1').trigger('click');

    expect(editSection).toHaveBeenCalledWith(1);
  });

  it('should call editSection when the section row is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.getByTestId('actions-section-item-2').trigger('click');

    expect(editSection).toHaveBeenCalledWith(2);
  });

  it('should render a drag handle for every section', () => {
    const wrapper = mountComponent();

    expect(wrapper.findByTestId('actions-drag-section-handle-0').exists()).toBe(true);
    expect(wrapper.findByTestId('actions-drag-section-handle-1').exists()).toBe(true);
    expect(wrapper.findByTestId('actions-drag-section-handle-2').exists()).toBe(true);
  });

  it('should emit update:sections when draggable emits update:model-value', async () => {
    const wrapper = mountComponent();
    const reordered: UtilityBarSection[] = [
      { id: 'actions', name: 'UtilityBarActions', visible: true },
      { id: 'logo', name: 'UtilityBarLogo', visible: true },
      { id: 'search', name: 'UtilityBarSearch', visible: false },
    ];

    const draggable = wrapper.getComponent(DraggableStub);
    draggable.vm.$emit('update:model-value', reordered);
    await nextTick();

    expect(wrapper.emitted('update:sections')).toEqual([[reordered]]);
  });

  it('should call toggleSectionMenu when the kebab button is clicked', async () => {
    const wrapper = mountComponent();

    await wrapper.getByTestId('actions-menu-section-2').trigger('click');

    expect(toggleSectionMenu).toHaveBeenCalledWith(2);
  });

  it('should render the visibility toggle only for the section whose menu is open', () => {
    const wrapper = mountComponent({ openSectionMenuIndex: 1 });

    expect(wrapper.findByTestId('actions-toggle-visibility-section-1').exists()).toBe(true);
    expect(wrapper.findByTestId('actions-toggle-visibility-section-0').exists()).toBe(false);
    expect(wrapper.findByTestId('actions-toggle-visibility-section-2').exists()).toBe(false);
  });

  it('should call toggleSectionVisibility with the correct index when the switch flips', async () => {
    const wrapper = mountComponent({ openSectionMenuIndex: 1 });

    await wrapper.getByTestId('actions-toggle-visibility-section-1').trigger('click');

    expect(toggleSectionVisibility).toHaveBeenCalledWith(1);
  });

  it('should close the open menu when the document is clicked outside', async () => {
    mountComponent({ openSectionMenuIndex: 2 });

    document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    await nextTick();

    expect(toggleSectionMenu).toHaveBeenCalledWith(2);
  });
});
