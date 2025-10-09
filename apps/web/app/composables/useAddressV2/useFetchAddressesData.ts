// composables/useFetchAddressesData.ts
import type { ApiError, Address } from '@plentymarkets/shop-api';
import { AddressType } from '@plentymarkets/shop-api';

export const useFetchAddressesData = () => {
  const state = useState('useFetchAddressesData', () => ({
    loading: false,
  }));

  const { set: setShippingAddressStore } = useAddressStore(AddressType.Shipping);
  const { set: setBillingAddressStore } = useAddressStore(AddressType.Billing);

  const fetch = async () => {
    try {
      state.value.loading = true;

      const data = await useSdk().plentysystems.getAddressesData({ types: [] });

      // TODO: need to have a typeID on the addresses so i can split them up properly
      const uniqueAddresses = data.data.addresses.filter(
        (addr, index, self) => index === self.findIndex((a) => a.id === addr.id),
      );

      setAddresses(uniqueAddresses, uniqueAddresses);

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
      // TODO: need to have a typeID on the addresses so i can split them up properly
      const uniqueAddresses = data.value.data.addresses.filter(
        (addr, index, self) => index === self.findIndex((a) => a.id === addr.id),
      );

      setAddresses(uniqueAddresses, uniqueAddresses);
    }

    state.value.loading = false;
  };

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

  return {
    fetch,
    fetchServer,
    ...toRefs(state.value),
  };
};
