import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import type { UtilityBarSection } from '~/components/blocks/UtilityBar/types';
import UtilityBarForm from '../UtilityBarForm.vue';

const { useUtilityBarConfigurationMock, useUtilityBarFormMock, useUtilityBarActionsMock, getEditorTranslationMock } =
  vi.hoisted(() => {
    return {
      useUtilityBarConfigurationMock: vi.fn(),
      useUtilityBarFormMock: vi.fn(),
      useUtilityBarActionsMock: vi.fn(),
      getEditorTranslationMock: vi.fn((key: string) => key),
    };
  });

mockNuxtImport('useUtilityBarConfiguration', () => useUtilityBarConfigurationMock);
mockNuxtImport('useUtilityBarForm', () => useUtilityBarFormMock);
mockNuxtImport('useUtilityBarActions', () => useUtilityBarActionsMock);
mockNuxtImport('getEditorTranslation', () => getEditorTranslationMock);

describe('UtilityBarForm', () => {
  const sections = ref<UtilityBarSection[]>([
    { id: 'logo', name: 'UtilityBarLogo', visible: true },
    { id: 'search', name: 'UtilityBarSearch', visible: true },
    { id: 'actions', name: 'UtilityBarActions', visible: true },
  ]);

  const elementsOpen = ref(true);
  const layoutOpen = ref(true);
  const editingSectionIndex = ref<number | undefined>(undefined);
  const openSectionMenuIndex = ref<number | undefined>(undefined);
  const currentEditingSectionIndex = computed(() => editingSectionIndex.value);
  const sectionForm = shallowRef(null);

  const getSectionLabel = vi.fn();
  const editSection = vi.fn();
  const exitEditMode = vi.fn();
  const toggleSectionMenu = vi.fn();
  const toggleSectionVisibility = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    editingSectionIndex.value = undefined;
    openSectionMenuIndex.value = undefined;

    useUtilityBarConfigurationMock.mockReturnValue({
      sections,
    });

    useUtilityBarFormMock.mockReturnValue({
      elementsOpen,
      layoutOpen,
      editingSectionIndex,
      openSectionMenuIndex,
      currentEditingSectionIndex,
      sectionForm,
    });

    useUtilityBarActionsMock.mockReturnValue({
      getSectionLabel,
      editSection,
      exitEditMode,
      toggleSectionMenu,
      toggleSectionVisibility,
    });
  });

  it('should render sections list and layout settings when no section is being edited', () => {
    const wrapper = mount(UtilityBarForm, {
      props: {
        uuid: 'utility-form-uuid',
      },
      global: {
        stubs: {
          BlocksUtilityBarPartialsUtilityBarSectionsList: {
            template: '<div data-testid="sections-list-stub" />',
          },
          BlocksUtilityBarPartialsUtilityBarSectionEditor: {
            template: '<div data-testid="section-editor-stub" />',
          },
          BlocksUtilityBarPartialsUtilityBarLayoutSettings: {
            template: '<div data-testid="layout-settings-stub" />',
          },
        },
      },
    });

    expect(wrapper.findByTestId('utility-bar-form').exists()).toBe(true);
    expect(wrapper.findByTestId('sections-list-stub').exists()).toBe(true);
    expect(wrapper.findByTestId('layout-settings-stub').exists()).toBe(true);
    expect(wrapper.findByTestId('section-editor-stub').exists()).toBe(false);
  });

  it('should render section editor only when a section is being edited', () => {
    editingSectionIndex.value = 1;

    const wrapper = mount(UtilityBarForm, {
      props: {
        uuid: 'utility-form-uuid',
      },
      global: {
        stubs: {
          BlocksUtilityBarPartialsUtilityBarSectionsList: {
            template: '<div data-testid="sections-list-stub" />',
          },
          BlocksUtilityBarPartialsUtilityBarSectionEditor: {
            template: '<div data-testid="section-editor-stub" />',
          },
          BlocksUtilityBarPartialsUtilityBarLayoutSettings: {
            template: '<div data-testid="layout-settings-stub" />',
          },
        },
      },
    });

    expect(wrapper.findByTestId('section-editor-stub').exists()).toBe(true);
    expect(wrapper.findByTestId('sections-list-stub').exists()).toBe(false);
    expect(wrapper.findByTestId('layout-settings-stub').exists()).toBe(false);
  });

  it('should expose exitEditMode', () => {
    const wrapper = mount(UtilityBarForm, {
      props: {
        uuid: 'utility-form-uuid',
      },
      global: {
        stubs: {
          BlocksUtilityBarPartialsUtilityBarSectionsList: true,
          BlocksUtilityBarPartialsUtilityBarSectionEditor: true,
          BlocksUtilityBarPartialsUtilityBarLayoutSettings: true,
        },
      },
    });

    wrapper.vm.exitEditMode();

    expect(exitEditMode).toHaveBeenCalledTimes(1);
  });
});
