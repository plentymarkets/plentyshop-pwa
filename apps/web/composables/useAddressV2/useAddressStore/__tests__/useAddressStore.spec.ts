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

describe('useAddressStore', () => {
  afterAll(() => {
    clearNuxtState();
  });

  it('should set addresses', () => {
    const type = AddressType.Billing;
    const { set, addresses } = useAddressStore(type);
    set([addressFixture]);
    expect(addresses.value).toEqual([addressFixture]);
  });

  it('should create address', () => {
    const type = AddressType.Billing;
    const { create, addresses } = useAddressStore(type);
    create(addressFixture);

    const address = addresses.value[0];
    expect(address).toEqual(addressFixture);
  });

  it('should get address', () => {
    const type = AddressType.Billing;
    const { get, set } = useAddressStore(type);
    set([addressFixture]);
    expect(get(addressFixture.id)).toEqual(addressFixture);
  });

  it('should update address', () => {
    const type = AddressType.Billing;
    const { update, get, set } = useAddressStore(type);
    set([addressFixture]);
    const updatedAddress = { ...addressFixture, name1: 'Updated' };
    update(updatedAddress);
    expect(get(addressFixture.id)).toEqual(updatedAddress);
  });

  it('should destroy address', () => {
    const type = AddressType.Billing;
    const { destroy, get, set } = useAddressStore(type);
    set([addressFixture]);
    destroy(addressFixture.id);
    expect(get(addressFixture.id)).toBeUndefined();
  });

  it('should clear addresses', () => {
    const type = AddressType.Billing;
    const { set, clear, addresses } = useAddressStore(type);
    set([addressFixture]);
    clear();
    expect(addresses.value).toEqual([]);
  });
});
