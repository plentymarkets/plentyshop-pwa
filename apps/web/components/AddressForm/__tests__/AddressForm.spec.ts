import { mount } from '@vue/test-utils';
import AddressForm from '~/components/AddressForm/AddressForm.vue';
import { AddressType } from '@plentymarkets/plentymarkets-sdk/packages/api-client/src';

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
