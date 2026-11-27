import { mountSuspended } from '@nuxt/test-utils/runtime';
import { AddressType } from '@plentymarkets/shop-api';
import AddressFormBilling from '../AddressFormBilling.vue';

describe('theme <AddressFormBilling />', () => {
  it('should render the save button as primary button', async () => {
    useAddressForm(AddressType.Billing).add.value = true;

    const wrapper = await mountSuspended(AddressFormBilling, {
      props: { disabled: false, addAddress: true },
    });

    const saveButton = wrapper.find(`[data-testid="save-address-${AddressType.Billing}"]`);

    expect(saveButton.classes()).toContain('bg-primary-500');
    expect(saveButton.classes()).not.toContain('ring-primary-500');
  });
});
