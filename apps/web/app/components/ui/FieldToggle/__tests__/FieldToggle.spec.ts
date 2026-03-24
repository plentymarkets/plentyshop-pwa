import { mount } from '@vue/test-utils';
import { UiFieldToggle } from '#components';

describe('<FieldToggle />', () => {
  it('should render component', () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label: 'Test Label',
      },
    });

    expect(wrapper.getByTestId('field-toggle')).toBeDefined();
  });

  it('should display the label', () => {
    const label = 'Enable Feature';
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label,
      },
    });

    expect(wrapper.text()).toContain(label);
  });

  it('should render with correct modelValue', () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: true,
        label: 'Test',
      },
    });

    const switchComponent = wrapper.findComponent({ name: 'SfSwitch' });
    expect(switchComponent.props('modelValue')).toBe(true);
  });

  it('should pass disabled prop to switch', () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label: 'Test',
        disabled: true,
      },
    });

    const switchComponent = wrapper.findComponent({ name: 'SfSwitch' });
    expect(switchComponent.attributes('disabled')).toBeDefined();
  });

  it('should emit update:modelValue when switch changes', async () => {
    const wrapper = mount(UiFieldToggle, {
      props: {
        modelValue: false,
        label: 'Test',
      },
    });

    const switchComponent = wrapper.findComponent({ name: 'SfSwitch' });
    await switchComponent.vm.$emit('update:model-value', true);

    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([true]);
  });
});
