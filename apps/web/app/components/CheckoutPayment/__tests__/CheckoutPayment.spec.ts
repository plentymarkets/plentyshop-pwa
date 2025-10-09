import { mount } from '@vue/test-utils';
import { CheckoutPayment } from '#components';

describe('<CheckoutPayment />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(CheckoutPayment, {
      props: {
        paymentMethods: {
          list: [],
          selected: 0,
        },
      },
    });

    expect(getByTestId('checkout-payment'));
  });
});
