import { mount } from '@vue/test-utils';
import ColorPickerPanel from '../ColorPickerPanel.vue';

describe('ColorPickerPanel', () => {
  const createWrapper = (
    props?: Partial<{
      modelValue: string;
      activeTab: 'shop' | 'picker';
      primaryColor: string | null;
      secondaryColor: string | null;
    }>,
  ) => {
    return mount(ColorPickerPanel, {
      props: {
        modelValue: '#000000',
        activeTab: 'picker',
        primaryColor: '#111111',
        secondaryColor: '#222222',
        ...props,
      },
      global: {
        stubs: {
          'color-picker-block': {
            props: ['modelValue'],
            template: '<div data-testid="picker-view">{{ modelValue }}</div>',
          },
          EditorColorPickerTabs: {
            props: ['activeTab'],
            setup(_props, { emit }) {
              const onSwitch = () => {
                emit('update:activeTab', 'shop');
              };
              return { onSwitch };
            },
            template:
              '<div><span data-testid="tabs-active">{{ activeTab }}</span><button type="button" data-testid="tabs-switch" @click="onSwitch" /></div>',
          },
        },
      },
    });
  };

  it('should initialize with given props in picker view', () => {
    const wrapper = createWrapper({ modelValue: '#123456', activeTab: 'picker' });

    expect(wrapper.get('[data-testid="tabs-active"]').text()).toBe('picker');
    expect(wrapper.get('[data-testid="picker-view"]').text()).toBe('#123456');
    expect(wrapper.find('button.h-8.w-8').exists()).toBe(false);
  });

  it('should emit update:activeTab when tabs emit update', async () => {
    const wrapper = createWrapper({ activeTab: 'picker' });

    const switchButton = wrapper.get('[data-testid="tabs-switch"]');
    await switchButton.trigger('click');

    expect(wrapper.emitted('update:activeTab')?.[0]).toEqual(['shop']);
  });

  it('should switch between picker and shop views based on activeTab prop', async () => {
    const wrapper = createWrapper({ activeTab: 'picker' });

    expect(wrapper.find('[data-testid="picker-view"]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('These are your primary shop colors');

    await wrapper.setProps({ activeTab: 'shop' });

    expect(wrapper.find('[data-testid="picker-view"]').exists()).toBe(false);
    expect(wrapper.text()).toContain('These are your primary shop colors');
  });

  it('should render primary and secondary color buttons with correct styles and emit tokens', async () => {
    const wrapper = mount(ColorPickerPanel, {
      props: {
        modelValue: '#000000',
        activeTab: 'shop',
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00',
      },
      global: {
        stubs: {
          'color-picker-block': true,
          EditorColorPickerTabs: {
            template: '<div data-testid="tabs-stub" />',
          },
        },
      },
    });

    const buttons = wrapper.findAll('button.h-8.w-8');
    expect(buttons).toHaveLength(2);

    const primaryButton = buttons[0];
    const secondaryButton = buttons[1];

    if (!primaryButton || !secondaryButton) {
      throw new Error('Expected two color buttons to be rendered');
    }

    expect(primaryButton.attributes('style') || '').toContain('background-color: #ff0000');
    expect(secondaryButton.attributes('style') || '').toContain('background-color: #00ff00');

    await primaryButton.trigger('click');
    await secondaryButton.trigger('click');

    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['__theme_primary__']);
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual(['__theme_secondary__']);
  });
});
