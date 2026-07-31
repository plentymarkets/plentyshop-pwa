import type { ActiveShippingCountry, ApiError, Address } from '@plentymarkets/shop-api';
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

  const getAuthorizedAddresses = (addresses: Address[]) => ({
    billing: addresses.filter((addr) => addr.typeId === AddressType.Billing),
    shipping: addresses.filter((addr) => addr.typeId === AddressType.Shipping),
  });

  const getGuestAddresses = (addresses: Address[]) => {
    const billing = addresses.find((addr) => addr.id === cart.value.customerInvoiceAddressId);
    const shipping = addresses.find((addr) => addr.id === cart.value.customerShippingAddressId);

    return {
      billing: billing ? [{ ...billing, primary: true }] : ([] as Address[]),
      shipping: shipping ? [{ ...shipping, primary: true }] : ([] as Address[]),
    };
  };

  const processAddresses = (addresses: Address[]) => {
    const { billing, shipping } = isAuthorized.value ? getAuthorizedAddresses(addresses) : getGuestAddresses(addresses);
    setAddresses(billing, shipping);
  };

  const fetch = async () => {
    try {
      state.value.loading = true;

      const { data } = await useSdk().plentysystems.getAddressesData({
        types: [],
        lang: locale.value,
      });

      if (data?.addresses) {
        processAddresses(data.addresses);
      }

      if (data?.countries) {
        setCountries(data.countries.default as ActiveShippingCountry[], data.countries.geoRegulated);
      }
    } catch (error) {
      useHandleError(error as ApiError);
      setAddresses([], []);
    } finally {
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

    const responseData = data.value?.data;
    if (responseData?.addresses) {
      processAddresses(responseData.addresses);
    }

    if (responseData?.countries) {
      setCountries(responseData.countries.default as ActiveShippingCountry[], responseData.countries.geoRegulated);
    }

    state.value.loading = false;
  };

  return {
    fetch,
    fetchServer,
    ...toRefs(state.value),
  };
};
