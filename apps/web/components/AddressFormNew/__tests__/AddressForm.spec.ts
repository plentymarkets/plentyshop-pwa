import { mount } from '@vue/test-utils';
import { AddressForm } from '#components';
import { AddressType } from '@plentymarkets/shop-api';

describe('<AddressForm />', () => {
  it('should render component', () => {
    const { getByTestId } = mount(AddressForm, {
      props: {
        type: AddressType.Billing,
        countries: [],
      },
    });
    expect(getByTestId('address-form'));
  });
});
