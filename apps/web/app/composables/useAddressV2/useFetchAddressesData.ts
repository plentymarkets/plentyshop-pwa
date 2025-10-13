// composables/useFetchAddressesData.ts
import type { ApiError, Address } from '@plentymarkets/shop-api';
import { AddressType } from '@plentymarkets/shop-api';

export const useFetchAddressesData = () => {
  const state = useState('useFetchAddressesData', () => ({
    loading: false,
  }));

  const { set: setShippingAddressStore } = useAddressStore(AddressType.Shipping);
  const { set: setBillingAddressStore } = useAddressStore(AddressType.Billing);

  const setAddresses = (billingAddresses: Address[], shippingAddresses: Address[]) => {
    setBillingAddressStore(billingAddresses);
    setShippingAddressStore(shippingAddresses);

    if (billingAddresses.length) {
      usePrimaryAddress(AddressType.Billing).primaryAddressId.value =
        billingAddresses.find((item) => item.primary)?.id || -1;
    }
    if (shippingAddresses.length) {
      usePrimaryAddress(AddressType.Shipping).primaryAddressId.value =
        shippingAddresses.find((item) => item.primary)?.id || -1;
    }
  };

  const fetch = async () => {
    try {
      state.value.loading = true;

      const data = await useSdk().plentysystems.getAddressesData({ types: [] });

      const billingAddresses = data.data.addresses.filter((addr) => addr.typeId === AddressType.Billing);
      const shippingAddresses = data.data.addresses.filter((addr) => addr.typeId === AddressType.Shipping);

      setAddresses(billingAddresses, shippingAddresses);
      state.value.loading = false;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      state.value.loading = false;
    }
  };

  const fetchServer = async () => {
    state.value.loading = true;

    const { data, error } = await useAsyncData('addresses-data', () =>
      useSdk().plentysystems.getAddressesData({ types: [] }),
    );

    useHandleError(error.value ?? null);

    if (data.value?.data.addresses) {
      const billingAddresses = data.value.data.addresses.filter((addr) => addr.typeId === AddressType.Billing);
      const shippingAddresses = data.value.data.addresses.filter((addr) => addr.typeId === AddressType.Shipping);

      setAddresses(billingAddresses, shippingAddresses);
    }

    state.value.loading = false;
  };

  return {
    fetch,
    fetchServer,
    ...toRefs(state.value),
  };
};
