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

    it('should always show form if the user has no addresses', () => {

        const { shippingOpen } = useCheckout();
        expect(shippingOpen.value).toBe(true);
    });

    it('should combine shipping and billing as default', () => {
        const { combineShippingAndBilling } = useCheckout();
        expect(combineShippingAndBilling.value).toBe(true);
    });
    it.todo('should hide the option for guest users to select addresses');
    it('should show billing form if the guest user unckecks combineShippingAndBilling', () => {
        const { combineShippingAndBilling, billingOpen } = useCheckout();
        combineShippingAndBilling.value = false;

        expect(billingOpen.value).toBe(true);
    });

    it('should show display address if user has addresses', () => {
        useAddress.mockImplementation((type) => {
            if (type === AddressType.Shipping) {
                return {
                    displayAddress: ref({ id: 1 }),
                    hasDisplayAddress: ref(true)
                }
            }
            else {
                return {
                    displayAddress: ref({}),
                    hasDisplayAddress: ref(false)
                }
            }
        });
        const { shippingOpen } = useCheckout();

        expect(shippingOpen.value).toBe(false);
    });

    it('should show both addresses if user has a shipping and billing address', () => {
        useAddress.mockImplementation((type) => {
            if (type === AddressType.Shipping) {
                return {
                    displayAddress: ref({ id: 1 }),
                    hasDisplayAddress: ref(true)
                }
            }
            else {
                return {
                    displayAddress: ref({ id : 2}),
                    hasDisplayAddress: ref(true)
                }
            }
        });
        const { shippingOpen, billingOpen, combineShippingAndBilling } = useCheckout();

        expect(combineShippingAndBilling.value).toBe(false);
        expect(billingOpen.value).toBe(false);
        expect(shippingOpen.value).toBe(false);
    });

    it('should save billing and shipping with one call if combineShippingAndBilling is true', () => {

        

        const { save, combineShippingAndBilling } = useCheckout();
        combineShippingAndBilling.value = true;
        save();

    
    });
    
    it.todo('should only validate forms that are open');
    it.todo('should only save forms that are open');
    it.todo('should save forms separately if combineShippingAndBilling is false');
    it.todo('should only save forms that were touched???');
    it.todo('should set is valid to true if both forms are closed and display addresses are set');

    it.todo('should be able to select an address and set the displayAddress');
































});