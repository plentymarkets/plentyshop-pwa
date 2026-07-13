import { mount } from '@vue/test-utils';
import { Price } from '#components';

describe('<Price />', () => {
  it('should render the price', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: null,
        displayVatHint: false,
      },
    });

    expect(wrapper.getByTestId('price').text()).toContain('10');
  });

  it('should render the vat hint by default', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: null,
      },
    });

    expect(wrapper.getByTestId('price').text()).toContain('*');
  });

  it('should not render the vat hint when displayVatHint is false', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: null,
        displayVatHint: false,
      },
    });

    expect(wrapper.getByTestId('price').text()).not.toContain('*');
  });

  it('should render the crossed price when it differs from the price', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: 20,
        displayVatHint: false,
      },
    });

    expect(wrapper.text()).toContain('20');
  });

  it('should not render the crossed price when it is null', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: null,
        displayVatHint: false,
      },
    });

    expect(wrapper.findByTestId('price').exists()).toBe(true);
    expect(wrapper.text()).not.toContain('20');
  });

  it('should not render the crossed price when it is equal to the price', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: 10,
        displayVatHint: false,
      },
    });

    const text = wrapper.text();
    const occurrences = text.split('10').length - 1;

    expect(occurrences).toBe(1);
  });

  it('should use a custom test id when provided', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: null,
        displayVatHint: false,
        testId: 'custom-price',
      },
    });

    expect(wrapper.findByTestId('price').exists()).toBe(false);
    expect(wrapper.findByTestId('custom-price').exists()).toBe(true);
  });

  it('should apply the small size classes when size is sm', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: null,
        displayVatHint: false,
        size: 'sm',
      },
    });

    const priceElement = wrapper.getByTestId('price');
    expect(priceElement.classes()).toContain('typography-text-sm');
    expect(priceElement.classes()).not.toContain('text-2xl');
  });

  it('should apply the base size classes by default when size is not provided', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: null,
        displayVatHint: false,
      },
    });

    const priceElement = wrapper.getByTestId('price');
    expect(priceElement.classes()).toContain('text-2xl');
    expect(priceElement.classes()).not.toContain('typography-text-sm');
  });

  it('should apply the base size classes when size is base', () => {
    const wrapper = mount(Price, {
      props: {
        price: 10,
        crossedPrice: null,
        displayVatHint: false,
        size: 'base',
      },
    });

    const priceElement = wrapper.getByTestId('price');
    expect(priceElement.classes()).toContain('text-2xl');
    expect(priceElement.classes()).not.toContain('typography-text-sm');
  });
});
