// @vitest-environment node
import { ref } from 'vue';
import { AddressType } from '@plentymarkets/shop-api';
import { createAddressLogic } from '../createAddressLogic';
import type { UseAddressDeps, UseAddressMethodsState } from '../types';
import { vi, describe, it, expect } from 'vitest';

const addressMock = {
  id: 1,
  street: 'street',
  houseNumber: '1',
  postalCode: '12345',
  town: 'town',
  country: 'country',
  state: 'state',
  firstName: 'firstName',
  lastName: 'lastName',
  phone: '1234567890',
  email: 'f.l@plentymarkets.com',
  streetName: 'streetName',
  apartment: 'apartment',
  city: 'city',
  zipCode: 'zipCode',
  phoneNumber: '123234575675',
  primary: false,
};

const makeState = (): ReturnType<typeof ref<UseAddressMethodsState>> =>
  ref({
    data: [],
    useAsShippingAddress: true,
    loading: false,
    defaultAddressId: 0,
    defaultAddress: {},
    cartAddressId: 0,
    cartAddress: {},
    displayAddress: {},
  } as UseAddressMethodsState);

const makeDeps = (overrides: Partial<UseAddressDeps['sdk']['plentysystems']> = {}): UseAddressDeps => ({
  sdk: {
    plentysystems: {
      getAddresses: vi.fn().mockResolvedValue({ data: [] }),
      doSaveAddress: vi.fn().mockResolvedValue({ data: [] }),
      deleteAddress: vi.fn().mockResolvedValue({ data: [] }),
      setCheckoutAddress: vi.fn().mockResolvedValue({}),
      ...overrides,
    },
  },
  cart: ref({} as any),
  handleError: vi.fn(),
});

describe('createAddressLogic', () => {
  it('should set displayAddress after saveAddress', async () => {
    const state = makeState();
    const deps = makeDeps({
      doSaveAddress: vi.fn().mockResolvedValue({ data: [addressMock] }),
    });

    const { saveAddress, displayAddress } = createAddressLogic(AddressType.Shipping, state, deps);
    await saveAddress(addressMock);

    expect(displayAddress.value.id).toEqual(addressMock.id);
  });

  it('should update data after saveAddress', async () => {
    const state = makeState();
    const deps = makeDeps({
      doSaveAddress: vi.fn().mockResolvedValue({ data: [addressMock] }),
    });

    const { saveAddress, data } = createAddressLogic(AddressType.Shipping, state, deps);
    expect(data.value.length).toBe(0);

    await saveAddress(addressMock);

    expect(data.value).toEqual([addressMock]);
  });

  it('should remove address after deleteAddress', async () => {
    const state = makeState();
    const deps = makeDeps({
      getAddresses: vi.fn().mockResolvedValue({ data: [{ ...addressMock, id: 1 }, { ...addressMock, id: 2 }] }),
      deleteAddress: vi.fn().mockResolvedValue({ data: [{ ...addressMock, id: 2 }] }),
    });

    const { getAddresses, deleteAddress, data } = createAddressLogic(AddressType.Shipping, state, deps);
    await getAddresses();
    await deleteAddress(1);

    expect(data.value.find((a) => a.id === 1)).toBeUndefined();
    expect(data.value).toHaveLength(1);
  });

  it('should call setCheckoutAddress when setDisplayAddress is called with setAsCheckoutAddress true', () => {
    const state = makeState();
    const deps = makeDeps();

    const { setDisplayAddress } = createAddressLogic(AddressType.Shipping, state, deps);
    setDisplayAddress(addressMock, true);

    expect(deps.sdk.plentysystems.setCheckoutAddress).toHaveBeenCalledWith({
      typeId: AddressType.Shipping,
      addressId: addressMock.id,
    });
  });

  it('should not call setCheckoutAddress when setDisplayAddress is called without flag', () => {
    const state = makeState();
    const deps = makeDeps();

    const { setDisplayAddress } = createAddressLogic(AddressType.Shipping, state, deps);
    setDisplayAddress(addressMock);

    expect(deps.sdk.plentysystems.setCheckoutAddress).not.toHaveBeenCalled();
  });

  it('should set loading to false after getAddresses resolves', async () => {
    const state = makeState();
    const deps = makeDeps({
      getAddresses: vi.fn().mockResolvedValue({ data: [addressMock] }),
    });

    const { getAddresses, loading } = createAddressLogic(AddressType.Shipping, state, deps);
    await getAddresses();

    expect(loading.value).toBe(false);
  });

  it('should call handleError when getAddresses throws', async () => {
    const error = new Error('network error');
    const state = makeState();
    const deps = makeDeps({
      getAddresses: vi.fn().mockRejectedValue(error),
    });

    const { getAddresses, loading } = createAddressLogic(AddressType.Shipping, state, deps);
    await getAddresses();

    expect(deps.handleError).toHaveBeenCalledWith(error);
    expect(loading.value).toBe(false);
  });

  it('should update defaultAddressId after setDefault', async () => {
    const state = makeState();
    const primaryAddress = { ...addressMock, id: 5 };
    const deps = makeDeps({
      doSaveAddress: vi.fn().mockResolvedValue({ data: [primaryAddress] }),
    });

    const { setDefault, defaultAddressId } = createAddressLogic(AddressType.Billing, state, deps);
    await setDefault(primaryAddress);

    expect(defaultAddressId.value).toBe(5);
  });

  it('should call setCheckoutAddress with Billing type when saveAddress is called with combineShippingBilling', async () => {
    const state = makeState();
    const deps = makeDeps({
      doSaveAddress: vi.fn().mockResolvedValue({ data: [addressMock] }),
    });

    const { saveAddress } = createAddressLogic(AddressType.Shipping, state, deps);
    await saveAddress(addressMock, true);

    expect(deps.sdk.plentysystems.setCheckoutAddress).toHaveBeenCalledWith(
      expect.objectContaining({ typeId: AddressType.Billing }),
    );
  });
});
