import { shallowMount } from '@vue/test-utils';
import { ShippingMethod } from '#components';
import type { ShippingMethod as ApiShippingMethod } from '@plentymarkets/shop-api';

describe('<ShippingMethod />', () => {
  it('should render component', () => {
    const { getByTestId } = shallowMount(ShippingMethod, {
      props: {
        disabled: false,
        shippingMethods: [] as ApiShippingMethod[],
      },
    });

    expect(getByTestId('shipping-method'));
  });
});
