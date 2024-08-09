import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { AddressType } from '@plentymarkets/shop-api';

const { useCustomer } = vi.hoisted(() => {
    return {
        useCustomer: vi.fn().mockReturnValue({})
    }
});

const { useAddress } = vi.hoisted(() => {
    return {
        useAddress: vi.fn().mockReturnValue({})
    }
});


mockNuxtImport('useCustomer', () => {
    return useCustomer
});

mockNuxtImport('useAddress', () => {
    return useAddress
});

beforeEach(() => {
    useAddress.mockImplementation(() => {
        return {
            displayAddress: ref({ id: null}),
            hasDisplayAddress: ref(false)
        }
    })
});



afterEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
});


describe('useCheckout', () => {

});