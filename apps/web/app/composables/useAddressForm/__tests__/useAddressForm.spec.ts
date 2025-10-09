import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { AddressType } from '@plentymarkets/shop-api';

const addressFixture = {
  id: 1,
  name1: 'Test',
  firstName: 'Max',
  lastName: 'Power',
  streetName: 'Test street',
  apartment: '1',
  city: 'Kassel',
  country: '1',
  zipCode: '12345',
  phoneNumber: '1231244534654',
  primary: 0,
};

const { useCreateAddress } = vi.hoisted(() => {
  return {
    useCreateAddress: vi.fn().mockReturnValue({
      create: vi.fn(),
      clearInvalidVAT: vi.fn(),
    }),
  };
});

mockNuxtImport('useCreateAddress', () => {
  return useCreateAddress;
});

describe('useAddressForm', () => {
  afterAll(() => {
    clearNuxtState();
  });

  it('should create address', async () => {
    const createSpy = vi.fn().mockResolvedValue(true);
    const clearInvalidVATSpy = vi.fn();
    useCreateAddress.mockImplementation(() => {
      return {
        create: createSpy,
        clearInvalidVAT: clearInvalidVATSpy,
      };
    });

    const { save, addressToSave } = useAddressForm(AddressType.Billing);
    addressToSave.value = addressFixture;

    await save();
    expect(createSpy).toHaveBeenCalledWith(addressFixture);
    expect(clearInvalidVATSpy).toHaveBeenCalled();
  });

  it('should return if the address to save is empty', () => {
    const { save } = useAddressForm(AddressType.Billing);
    const result = save();
    expect(result).toBeTruthy();
  });
});
