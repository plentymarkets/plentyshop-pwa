// test save address method of useAddress

import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useAddress } from '../useAddress';
import { AddressType } from '@plentymarkets/shop-api';

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

const { useSdk } = vi.hoisted(() => {
  return {
    useSdk: vi.fn().mockReturnValue({
      plentysystems: {},
    }),
  };
});

mockNuxtImport('useSdk', () => {
  return useSdk;
});

afterEach(() => {
  vi.resetAllMocks();
  vi.clearAllMocks();
});

describe('useAddress unit', () => {
  it('should set display address with Id ', async () => {
    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          doSaveAddress: vi.fn().mockImplementation(() => {
            return {
              data: [addressMock],
            };
          }),
        },
      };
    });
    const { saveAddress, displayAddress } = useAddress(AddressType.Shipping, '001');
    await saveAddress(addressMock);

    expect(displayAddress.value.id).toEqual(addressMock.id);
  });

  it('should update addresses after save address', async () => {
    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          doSaveAddress: vi.fn().mockImplementation(() => {
            return {
              data: [addressMock],
            };
          }),
        },
      };
    });
    const { saveAddress, data } = useAddress(AddressType.Shipping, '002');
    expect(data.value.length).toBe(0);
    await saveAddress(addressMock);

    expect(data.value.length).toEqual(1);
  });

  it('should remove address after delete address', async () => {
    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          getAddresses: vi.fn().mockImplementation(() => {
            return {
              data: [
                { ...addressMock, id: 1 },
                { ...addressMock, id: 2 },
              ],
            };
          }),
          deleteAddress: vi.fn().mockImplementation(() => {
            return {
              data: [{ ...addressMock, id: 2 }],
            };
          }),
          setCheckoutAddress: vi.fn(),
        },
      };
    });

    const { getAddresses, deleteAddress, data } = useAddress(AddressType.Shipping, '003');

    await getAddresses();

    const addressIdToDelete = 1;

    await deleteAddress(addressIdToDelete);

    expect(data.value.find((address) => address.id === addressIdToDelete)).toBe(undefined);
  });

  it('should call setCheckoutAddress if setDisplayAddress is called with setAsCheckoutAddress true', async () => {
    const setCheckoutAddressSpy = vi.fn();
    useSdk.mockImplementation(() => {
      return {
        plentysystems: {
          setCheckoutAddress: setCheckoutAddressSpy,
        },
      };
    });
    const { setDisplayAddress } = useAddress(AddressType.Shipping, '004');

    setDisplayAddress(addressMock, true);

    expect(setCheckoutAddressSpy).toBeCalled();
  });
});
