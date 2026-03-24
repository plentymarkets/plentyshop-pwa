import { mount } from '@vue/test-utils';
import { UiFieldToggle } from '#components';

describe('<FieldToggle />', () => {
  it('should render component', () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: true,
        label: 'Enable Feature',
      },
    });

    expect(wrapper.find('[class*="flex items-center justify-between"]').exists()).toBe(true);
  });

  it('should display the label', () => {
    const label = 'Test Label';
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label,
      },
    });

    expect(wrapper.text()).toContain(label);
  });

  it('should emit update:modelValue when toggle changes', async () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label: 'Toggle Feature',
      },
    });

    const switchComponent = wrapper.findComponent({ name: 'SfSwitch' });
    await switchComponent.vm.$emit('update:modelValue', true);

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });

  it('should reflect modelValue prop on the switch', () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: true,
        label: 'Toggle Feature',
      },
    });

    const switchComponent = wrapper.findComponent({ name: 'SfSwitch' });
    expect(switchComponent.props('modelValue')).toBe(true);
  });

  it('should disable the switch when disabled prop is true', () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label: 'Disabled Toggle',
        disabled: true,
      },
    });

    const switchComponent = wrapper.findComponent({ name: 'SfSwitch' });
    expect(switchComponent.props('disabled')).toBe(true);
  });

  it('should enable the switch by default', () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label: 'Enabled Toggle',
      },
    });

    const switchComponent = wrapper.findComponent({ name: 'SfSwitch' });
    expect(switchComponent.props('disabled')).toBe(false);
  });

  it('should render info slot if provided', () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label: 'Toggle with Info',
      },
      slots: {
        info: '<span class="info-icon">ℹ️</span>',
      },
    });

    expect(wrapper.find('.info-icon').exists()).toBe(true);
    expect(wrapper.find('.info-icon').text()).toBe('ℹ️');
  });

  it('should update modelValue when prop changes', async () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label: 'Toggle Feature',
      },
    });

    await wrapper.setProps({ modelValue: true });

    const switchComponent = wrapper.findComponent({ name: 'SfSwitch' });
    expect(switchComponent.props('modelValue')).toBe(true);
  });
});


