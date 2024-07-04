import { mount } from '@vue/test-utils';
import { CheckoutAddress } from '#components';
import { AddressType } from '@plentymarkets/shop-api';

describe('<CheckoutAddress />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CheckoutAddress, {
      props: {
        type: AddressType.Billing,
        heading: '',
        description: '',
        buttonText: '',
      },
    });
    expect(getByTestId('checkout-address'));
  });
});