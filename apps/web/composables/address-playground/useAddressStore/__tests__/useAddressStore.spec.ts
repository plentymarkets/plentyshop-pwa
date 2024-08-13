import { AddressType } from "@plentymarkets/shop-api";

const addressFixture = {
    id: 1, name1: 'Test',
    firstName: null,
    lastName: null,
    streetName: null,
    apartment: null,
    city: '',
    country: undefined,
    zipCode: '',
    phoneNumber: undefined,
    primary: 0
};

describe('useAddressStore', () => {

    afterAll(() => {
        clearNuxtState();
    });


    it('should set addresses', () => {
        const { set, addresses } = useAddressStore(AddressType.Billing);
        const onSetSpy = vi.fn();

        // const unsubscribeCreate = onSet(onSetSpy);

        set([addressFixture]);

        expect(addresses.value).toEqual([addressFixture]);
        expect(onSetSpy).toHaveBeenCalledTimes(1);
        // unsubscribeCreate();
    });

    it('should destroy address', () => {
        const { set, destroy, addresses } = useAddressStore(AddressType.Billing);
        const onDestroySpy = vi.fn();

        // const unsubscribeDelete = onDestroy(onDestroySpy);

        set([addressFixture]);

        destroy(1);

        expect(addresses.value).toEqual([]);
        expect(onDestroySpy).toHaveBeenCalledTimes(1);
        // unsubscribeDelete();
    });

    it('should get address', () => {
        const { set, get } = useAddressStore(AddressType.Billing);

        set([addressFixture]);

        expect(get(1)).toEqual(addressFixture);
    });

    it('should update address', () => {
        const { set, update, addresses } = useAddressStore(AddressType.Billing);
        const onUpdateSpy = vi.fn();

        // const unsubscribeUpdate = onUpdate(onUpdateSpy);

        set([addressFixture]);

        update({ ...addressFixture, name1: 'Updated' });

        expect(addresses.value).toEqual([{ ...addressFixture, name1: 'Updated' }]);
        expect(onUpdateSpy).toHaveBeenCalledTimes(1);
        // unsubscribeUpdate();
    });

    it('should clear addresses', () => {
        const { set, clear, addresses } = useAddressStore(AddressType.Billing);

        set([addressFixture]);

        clear();

        expect(addresses.value).toEqual([]);
    });

    it(('should unsubscribe all events'), async () => {
        const { set, destroy } = useAddressStore(AddressType.Billing);

        const onSetSpy = vi.fn();
        const onDestroySpy = vi.fn();
        // onSet(onSetSpy);
        // onDestroy(onDestroySpy);

        // unsubscribeAll();

        set([addressFixture]);
        destroy(1);

        expect(onSetSpy).toHaveBeenCalledTimes(0);
        expect(onDestroySpy).toHaveBeenCalledTimes(0);

    });

    it('should unsubscribe event', () => {
        const { create, addresses } = useAddressStore(AddressType.Billing);
        const onCreateSpy = vi.fn();

        // const unsubscribeCreate = onCreate(onCreateSpy);

        create(addressFixture,[addressFixture]);

        expect(addresses.value).toEqual([addressFixture]);
        expect(onCreateSpy).toHaveBeenCalledTimes(1);

        // unsubscribeCreate();

        create(addressFixture, [{ ...addressFixture, id: 2 }]);

        expect(addresses.value).toEqual([{ ...addressFixture, id: 2 }]);
        expect(onCreateSpy).toHaveBeenCalledTimes(1);
    });

});