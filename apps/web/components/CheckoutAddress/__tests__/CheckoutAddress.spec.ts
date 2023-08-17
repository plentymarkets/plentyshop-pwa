import { mount } from '@vue/test-utils';
import CheckoutAddress from '~/components/CheckoutAddress/CheckoutAddress.vue';
import { AddressType } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

describe('<CheckoutAddress />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CheckoutAddress, {
      props: {
        type: AddressType.Billing,
        addresses: [],
        heading: '',
        description: '',
        buttonText: '',
      },
    });
    expect(getByTestId('checkout-address'));
  });
});