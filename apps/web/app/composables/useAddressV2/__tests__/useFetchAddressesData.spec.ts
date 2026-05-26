import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { AddressType } from '@plentymarkets/shop-api';
import type { Address } from '@plentymarkets/shop-api';
import { useFetchAddressesData } from '../useFetchAddressesData';

const billingAddress: Address = { id: 1, typeId: AddressType.Billing } as Address;
const shippingAddress: Address = { id: 2, typeId: AddressType.Shipping } as Address;
const countriesFixture = { default: [{ id: 1, name: 'Germany' }], geoRegulated: [] };

const setBillingMock = vi.fn();
const setShippingMock = vi.fn();
const setCountriesMock = vi.fn();
const primaryAddressId = ref(-1);

const { useSdk } = vi.hoisted(() => ({ useSdk: vi.fn() }));
const { useHandleError } = vi.hoisted(() => ({ useHandleError: vi.fn() }));
const { useAddressStore } = vi.hoisted(() => ({ useAddressStore: vi.fn() }));
const { useAggregatedCountries } = vi.hoisted(() => ({ useAggregatedCountries: vi.fn() }));
const { useCart } = vi.hoisted(() => ({ useCart: vi.fn() }));
const { useCustomer } = vi.hoisted(() => ({ useCustomer: vi.fn() }));
const { usePrimaryAddress } = vi.hoisted(() => ({ usePrimaryAddress: vi.fn() }));
const { useNuxtApp } = vi.hoisted(() => ({ useNuxtApp: vi.fn() }));
const { useState } = vi.hoisted(() => ({ useState: vi.fn() }));

mockNuxtImport('useSdk', () => useSdk);
mockNuxtImport('useHandleError', () => useHandleError);
mockNuxtImport('useAddressStore', () => useAddressStore);
mockNuxtImport('useAggregatedCountries', () => useAggregatedCountries);
mockNuxtImport('useCart', () => useCart);
mockNuxtImport('useCustomer', () => useCustomer);
mockNuxtImport('usePrimaryAddress', () => usePrimaryAddress);
mockNuxtImport('useNuxtApp', () => useNuxtApp);
mockNuxtImport('useState', () => useState);

const setupSdk = (response: unknown) =>
  useSdk.mockReturnValue({
    plentysystems: { getAddressesData: vi.fn().mockResolvedValue({ data: response }) },
  });

describe('useFetchAddressesData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useState.mockReturnValue(ref({ loading: false }));
    useNuxtApp.mockReturnValue({ $i18n: { locale: { value: 'en' } } });
    useAddressStore.mockImplementation((type: AddressType) => ({
      set: type === AddressType.Billing ? setBillingMock : setShippingMock,
    }));
    useAggregatedCountries.mockReturnValue({ setCountries: setCountriesMock });
    useCart.mockReturnValue({ data: ref({ customerInvoiceAddressId: 1, customerShippingAddressId: 2 }) });
    usePrimaryAddress.mockReturnValue({ primaryAddressId });
  });

  describe('when fetching for an authenticated customer', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({ isAuthorized: ref(true) });
    });

    it('should put billing addresses in the billing store', async () => {
      setupSdk({ addresses: [billingAddress, shippingAddress], countries: countriesFixture });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setBillingMock).toHaveBeenCalledWith([billingAddress]);
    });

    it('should put shipping addresses in the shipping store', async () => {
      setupSdk({ addresses: [billingAddress, shippingAddress], countries: countriesFixture });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setShippingMock).toHaveBeenCalledWith([shippingAddress]);
    });
  });

  describe('when fetching for a guest', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({ isAuthorized: ref(false) });
    });

    it('should use the invoice address from the cart as billing', async () => {
      setupSdk({ addresses: [billingAddress, shippingAddress], countries: countriesFixture });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setBillingMock).toHaveBeenCalledWith([expect.objectContaining({ id: billingAddress.id })]);
    });

    it('should use the shipping address from the cart as shipping', async () => {
      setupSdk({ addresses: [billingAddress, shippingAddress], countries: countriesFixture });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setShippingMock).toHaveBeenCalledWith([expect.objectContaining({ id: shippingAddress.id })]);
    });

    it('should mark the resolved addresses as primary', async () => {
      setupSdk({ addresses: [billingAddress, shippingAddress], countries: countriesFixture });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setBillingMock).toHaveBeenCalledWith([expect.objectContaining({ primary: true })]);
      expect(setShippingMock).toHaveBeenCalledWith([expect.objectContaining({ primary: true })]);
    });

    it('should send empty arrays when no cart address matches', async () => {
      useCart.mockReturnValue({ data: ref({ customerInvoiceAddressId: 99, customerShippingAddressId: 99 }) });
      setupSdk({ addresses: [billingAddress, shippingAddress], countries: countriesFixture });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setBillingMock).toHaveBeenCalledWith([]);
      expect(setShippingMock).toHaveBeenCalledWith([]);
    });

    it('should send empty arrays when the API returns no addresses', async () => {
      setupSdk({ addresses: [], countries: countriesFixture });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setBillingMock).toHaveBeenCalledWith([]);
      expect(setShippingMock).toHaveBeenCalledWith([]);
    });
  });

  describe('country data', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({ isAuthorized: ref(false) });
    });

    it('should save the countries returned by the API', async () => {
      setupSdk({ addresses: [], countries: countriesFixture });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setCountriesMock).toHaveBeenCalledWith(countriesFixture.default, countriesFixture.geoRegulated);
    });

    it('should not attempt to save countries when the response contains none', async () => {
      setupSdk({ addresses: [] });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setCountriesMock).not.toHaveBeenCalled();
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({ isAuthorized: ref(false) });
    });

    it('should report the error when the API call fails', async () => {
      useSdk.mockReturnValue({
        plentysystems: { getAddressesData: vi.fn().mockRejectedValue(new Error('network error')) },
      });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(useHandleError).toHaveBeenCalled();
    });

    it('should clear both address lists when the API call fails', async () => {
      useSdk.mockReturnValue({
        plentysystems: { getAddressesData: vi.fn().mockRejectedValue(new Error('network error')) },
      });
      const { fetch } = useFetchAddressesData();
      await fetch();
      expect(setBillingMock).toHaveBeenCalledWith([]);
      expect(setShippingMock).toHaveBeenCalledWith([]);
    });
  });

  describe('loading state', () => {
    beforeEach(() => {
      useCustomer.mockReturnValue({ isAuthorized: ref(false) });
    });

    it('should be true while the request is in flight and false once it completes', async () => {
      let resolveRequest!: (value: unknown) => void;
      useSdk.mockReturnValue({
        plentysystems: {
          getAddressesData: vi.fn().mockReturnValue(new Promise((res) => (resolveRequest = res))),
        },
      });

      const { fetch, loading } = useFetchAddressesData();
      const fetchPromise = fetch();
      expect(loading.value).toBe(true);

      resolveRequest({ data: { addresses: [], countries: countriesFixture } });
      await fetchPromise;
      expect(loading.value).toBe(false);
    });
  });
});
