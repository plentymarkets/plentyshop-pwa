import { mount } from '@vue/test-utils';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import ColorPicker from '../ColorPicker.vue';

const useDropdownMock = vi.fn((_options: unknown) => ({
  style: ref({ position: 'fixed', top: '0px', left: '0px' }),
  referenceRef: ref(null),
  floatingRef: ref(null),
}));

vi.mock('@storefront-ui/vue', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@storefront-ui/vue')>();
  return {
    ...actual,
    useDropdown: (options: unknown) => useDropdownMock(options),
  };
});

const { useSiteSettings } = vi.hoisted(() => {
  return {
    useSiteSettings: vi.fn().mockImplementation(() => ({ getSetting: vi.fn().mockReturnValue('#000000') })),
  };
});

mockNuxtImport('useSiteSettings', () => useSiteSettings);

const createWrapper = (
  props?: Partial<{
    modelValue: string | undefined;
    align?: 'left' | 'center' | 'right';
    showShopColors?: boolean;
  }>,
  stubs?: Record<string, unknown>,
) => {
  return mount(ColorPicker, {
    props: {
      modelValue: '',
      ...props,
    },
    global: {
      stubs: {
        EditorColorPickerPanel: true,
        ...stubs,
      },
    },
  });
};

describe('ColorPicker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useDropdownMock.mockImplementation((_options) => ({
      style: ref({ position: 'fixed', top: '0px', left: '0px' }),
      referenceRef: ref(null),
      floatingRef: ref(null),
    }));
    useSiteSettings.mockImplementation(() => ({ getSetting: vi.fn().mockReturnValue('#000000') }));
  });

  it('should initialize with correct props and default state', () => {
    const wrapper = createWrapper({ modelValue: '#ff0000' });

    const trigger = wrapper.get('div[style]');
    const style = trigger.attributes('style') ?? '';

    expect(style).toContain('background-color: #ff0000');

    const props = wrapper.props();
    expect(props.showShopColors).toBe(true);
  });

  it('should toggle dropdown open and closed when trigger is clicked', async () => {
    const wrapper = createWrapper();

    expect(wrapper.findComponent({ name: 'EditorColorPickerPanel' }).exists()).toBe(false);

    const trigger = wrapper.get('div[style]');
    await trigger.trigger('mousedown');
    await trigger.trigger('click');

    expect(wrapper.findComponent({ name: 'EditorColorPickerPanel' }).exists()).toBe(true);

    await trigger.trigger('click');

    expect(wrapper.findComponent({ name: 'EditorColorPickerPanel' }).exists()).toBe(false);
  });

  it('should emit update:modelValue when panel emits update', async () => {
    const wrapper = createWrapper(
      { modelValue: '#000000' },
      {
        EditorColorPickerPanel: {
          template:
            '<button type="button" data-testid="panel-button" @click="$emit(\'update:modelValue\', \'#123456\')" />',
        },
      },
    );

    const trigger = wrapper.get('div[style]');
    await trigger.trigger('click');

    const panelButton = wrapper.get('[data-testid="panel-button"]');
    await panelButton.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['#123456']);
  });

  it('should change activeTab when panel emits update:activeTab', async () => {
    const wrapper = createWrapper(
      { modelValue: '#000000' },
      {
        EditorColorPickerPanel: {
          props: ['modelValue', 'activeTab', 'primaryColor', 'secondaryColor', 'showShopColors'],
          template:
            '<div><span data-testid="active-tab">{{ activeTab }}</span><button type="button" data-testid="tab-button" @click="$emit(\'update:activeTab\', \'shop\')" /></div>',
        },
      },
    );

    const trigger = wrapper.get('div[style]');
    await trigger.trigger('click');

    expect(wrapper.get('[data-testid="active-tab"]').text()).toBe('picker');

    const tabButton = wrapper.get('[data-testid="tab-button"]');
    await tabButton.trigger('click');
    await nextTick();

    expect(wrapper.get('[data-testid="active-tab"]').text()).toBe('shop');
  });

  it.each([
    ['left', 'bottom-end'],
    ['center', 'bottom'],
    ['right', 'bottom-start'],
  ] as const)(
    'should set correct placement when align="%s", then placement should be "%s"',
    (align, expectedPlacement) => {
      createWrapper({ align });
      const options = (useDropdownMock.mock.calls[0] as unknown[])[0] as { placement: { value: string } };
      expect(options.placement.value).toBe(expectedPlacement);
    },
  );

  it('should default to bottom-end placement when align is not set', () => {
    createWrapper();
    const options = (useDropdownMock.mock.calls[0] as unknown[])[0] as { placement: { value: string } };
    expect(options.placement.value).toBe('bottom-end');
  });
});
