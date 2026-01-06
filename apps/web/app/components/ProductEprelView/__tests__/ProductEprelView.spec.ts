import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ProductEprelView from '../ProductEprelView.vue';
import type { ProductEprelViewProps } from '../types';

describe('ProductEprelView', () => {
  const defaultProps: ProductEprelViewProps = {
    labelurl: "",
    datasheeturl: ""
  };

  it('renders correctly', () => {
    const wrapper = mount(ProductEprelView, {
      props: defaultProps,
    });

    expect(wrapper.find('[data-testid="producteprelview"]').exists()).toBe(true);
  });

  it('accepts props correctly', () => {
    const wrapper = mount(ProductEprelView, {
      props: defaultProps,
    });

    expect(wrapper.props().labelurl).toStrictEqual(defaultProps.labelurl);
    expect(wrapper.props().datasheeturl).toStrictEqual(defaultProps.datasheeturl);
  });
});
