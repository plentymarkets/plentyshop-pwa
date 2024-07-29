import { mockNuxtImport } from "@nuxt/test-utils/runtime";
import { AddressType } from "@plentymarkets/shop-api";

const addressFixture = {
    id: 1,
    name1: 'Test',
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

const { useSdk } = vi.hoisted(() => {
    return {
        useSdk: vi.fn().mockReturnValue({
            plentysystems: {}
        })
    }
});

mockNuxtImport('useSdk', () => {
    return useSdk
});


describe('Integration test createAddress with store', () => {
    it('should create address and update store', async () => {

        useSdk.mockImplementation(() => {
            return {
                plentysystems: {
                    doSaveAddress: vi.fn().mockImplementation(() => {
                        return {
                            data: [
                                addressFixture
                            ]
                        }
                    })
                }
            }
        });

        const { create } = useCreateAddress(AddressType.Billing);
        await create(addressFixture);

        const { get } = useAddressStore(AddressType.Billing);
        const address = get(1);

        expect(address).toEqual(addressFixture);
    });

    it('should create address and call back with event subscription', async () => {

        useSdk.mockImplementation(() => {
            return {
                plentysystems: {
                    doSaveAddress: vi.fn().mockImplementation(() => {
                        return {
                            data: [
                                addressFixture
                            ]
                        }
                    })
                }
            }
        });

        const { create } = useCreateAddress(AddressType.Billing);
        const { onCreate } = useAddressStore(AddressType.Billing);
        const onCreateSpy = vi.fn();
        const unsubscribeCreate = onCreate(onCreateSpy);
        await create(addressFixture);
        
        expect(onCreateSpy).toHaveBeenCalledTimes(1);
        unsubscribeCreate();
    });
});