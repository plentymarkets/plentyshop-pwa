import type { ApiError, Address } from '@plentymarkets/shop-api';
import { AddressType } from '@plentymarkets/shop-api';

export const useFetchAddressesData = () => {
  const state = useState('useFetchAddressesData', () => ({
    loading: false,
  }));

  const { locale } = useNuxtApp().$i18n;
  const { set: setShippingAddressStore } = useAddressStore(AddressType.Shipping);
  const { set: setBillingAddressStore } = useAddressStore(AddressType.Billing);
  const { setCountries } = useAggregatedCountries();

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

      const data = await useSdk().plentysystems.getAddressesData({
        types: [],
        lang: locale.value,
      });

      const billingAddresses = data.data.addresses.filter((addr) => addr.typeId === AddressType.Billing);
      const shippingAddresses = data.data.addresses.filter((addr) => addr.typeId === AddressType.Shipping);

      setAddresses(billingAddresses, shippingAddresses);

      if (data.data.countries) {
        setCountries(data.data.countries.default, data.data.countries.geoRegulated);
      }

      state.value.loading = false;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      state.value.loading = false;
    }
  };

  const fetchServer = async () => {
    state.value.loading = true;

    const { data, error } = await useAsyncData('addresses-data', () =>
      useSdk().plentysystems.getAddressesData({
        types: [],
        lang: locale.value,
      }),
    );

    useHandleError(error.value ?? null);

    if (data.value?.data.addresses) {
      const billingAddresses = data.value.data.addresses.filter((addr) => addr.typeId === AddressType.Billing);
      const shippingAddresses = data.value.data.addresses.filter((addr) => addr.typeId === AddressType.Shipping);

      setAddresses(billingAddresses, shippingAddresses);
    }

    if (data.value?.data.countries) {
      setCountries(data.value.data.countries.default, data.value.data.countries.geoRegulated);
    }

    state.value.loading = false;
  };

  return {
    fetch,
    fetchServer,
    ...toRefs(state.value),
  };
};
