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
  const { data: cart } = useCart();
  const { isAuthorized } = useCustomer();

  const setPrimaryAddressId = (addresses: Address[], type: AddressType) => {
    if (addresses.length) {
      usePrimaryAddress(type).primaryAddressId.value = addresses.find((item) => item.primary)?.id || -1;
    }
  };

  const setAddresses = (billingAddresses: Address[], shippingAddresses: Address[]) => {
    setBillingAddressStore(billingAddresses);
    setShippingAddressStore(shippingAddresses);

    setPrimaryAddressId(billingAddresses, AddressType.Billing);
    setPrimaryAddressId(shippingAddresses, AddressType.Shipping);
  };

  const processAddresses = (addresses: Address[]) => {
    if (isAuthorized.value) {
      const billingAddresses = addresses.filter((addr) => addr.typeId === AddressType.Billing);
      const shippingAddresses = addresses.filter((addr) => addr.typeId === AddressType.Shipping);
      setAddresses(billingAddresses, shippingAddresses);
    } else {
      if (addresses.length > 0) {
        const shippingAddress = addresses.find((addr) => addr.id === cart.value.customerShippingAddressId);
        const billingAddress = addresses.find((addr) => addr.id === cart.value.customerInvoiceAddressId);

        if (shippingAddress) {
          shippingAddress.primary = true;
        }
        if (billingAddress) {
          billingAddress.primary = true;
        }

        setAddresses([billingAddress].filter(Boolean) as Address[], [shippingAddress].filter(Boolean) as Address[]);
      } else {
        setAddresses([], []);
      }
    }
  };

  const fetch = async () => {
    try {
      state.value.loading = true;

      const { data } = await useSdk().plentysystems.getAddressesData({
        types: [],
        lang: locale.value,
      });

      processAddresses(data.addresses);

      if (data.countries) {
        setCountries(data.countries.default, data.countries.geoRegulated);
      }

      state.value.loading = false;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      setAddresses([], []);
      state.value.loading = false;
    }
  };

  const fetchServer = async () => {
    try {
      state.value.loading = true;

      const { data, error } = await useAsyncData('addresses-data', () =>
        useSdk().plentysystems.getAddressesData({
          types: [],
          lang: locale.value,
        }),
      );
      useHandleError(error.value ?? null);

      if (data.value?.data.addresses) {
        processAddresses(data.value.data.addresses);
      }

      if (data.value?.data.countries) {
        setCountries(data.value.data.countries.default, data.value.data.countries.geoRegulated);
      }

      state.value.loading = false;
    } catch (error: unknown) {
      useHandleError(error as ApiError);
      setAddresses([], []);
      state.value.loading = false;
    }
  };

  return {
    fetch,
    fetchServer,
    ...toRefs(state.value),
  };
};
