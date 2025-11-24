import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductEprel from '../ProductEprel.vue';
import type { Product } from '@plentymarkets/shop-api';
import type { ProductEprelProps } from '../types';

const fakeProduct = {
  id: 1,
  texts: {},
  variationProperties: [],
} as unknown as Product;

describe('ProductEprel', () => {
  const defaultProps: ProductEprelProps = {
    product: fakeProduct,
    size: 'lg',
  };

  it('renders correctly', () => {
    const wrapper = mount(ProductEprel, {
      props: defaultProps,
    });

    expect(wrapper.find('[data-testid="producteprel"]').exists()).toBe(true);
  });

  it('accepts props correctly', () => {
    const wrapper = mount(ProductEprel, {
      props: defaultProps,
    });

    expect(wrapper.props().product).toStrictEqual(defaultProps.product);
  });
});
