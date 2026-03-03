import { mount } from '@vue/test-utils';
import ColorPickerTabs from '../ColorPickerTabs.vue';

describe('ColorPickerTabs', () => {
  const createWrapper = (activeTab: 'shop' | 'picker') => {
    return mount(ColorPickerTabs, {
      props: { activeTab },
    });
  };

  it('should render with shop tab active when activeTab is "shop"', () => {
    const wrapper = createWrapper('shop');

    const buttons = wrapper.findAll('button');
    const shopButton = buttons[0]!;
    const pickerButton = buttons[1]!;

    expect(shopButton.text()).toContain('Shop colors');
    expect(pickerButton.text()).toContain('Color Picker');

    expect(shopButton.classes()).toContain('bg-gray-100');
    expect(shopButton.classes()).toContain('text-gray-900');
    expect(shopButton.classes()).toContain('font-semibold');

    expect(pickerButton.classes()).not.toContain('bg-gray-100');
  });

  it('should render with picker tab active when activeTab is "picker"', () => {
    const wrapper = createWrapper('picker');

    const buttons = wrapper.findAll('button');
    const shopButton = buttons[0]!;
    const pickerButton = buttons[1]!;

    expect(pickerButton.classes()).toContain('bg-gray-100');
    expect(pickerButton.classes()).toContain('text-gray-900');
    expect(pickerButton.classes()).toContain('font-semibold');

    expect(shopButton.classes()).not.toContain('bg-gray-100');
  });

  it('should emit update:activeTab when clicking inactive tab', async () => {
    const wrapper = createWrapper('shop');

    const buttons = wrapper.findAll('button');
    const pickerButton = buttons[1]!;

    await pickerButton.trigger('click');

    expect(wrapper.emitted('update:activeTab')?.[0]).toEqual(['picker']);
  });

  it('should not emit when clicking already active tab', async () => {
    const wrapper = createWrapper('shop');

    const buttons = wrapper.findAll('button');
    const shopButton = buttons[0]!;

    await shopButton.trigger('click');

    expect(wrapper.emitted('update:activeTab')).toBeUndefined();
  });
});
