import { mountSuspended } from '@nuxt/test-utils/runtime';
import { AddressType } from '@plentymarkets/shop-api';
import AddressFormShipping from '../AddressFormShipping.vue';

describe('theme <AddressFormShipping />', () => {
  it('should render the save button as primary button', async () => {
    useAddressForm(AddressType.Shipping).add.value = true;

    const wrapper = await mountSuspended(AddressFormShipping, {
      props: { disabled: false, addAddress: true },
    });

    const saveButton = wrapper.find(`[data-testid="save-address-${AddressType.Shipping}"]`);

    expect(saveButton.classes()).toContain('bg-primary-500');
    expect(saveButton.classes()).not.toContain('ring-primary-500');
  });
});
