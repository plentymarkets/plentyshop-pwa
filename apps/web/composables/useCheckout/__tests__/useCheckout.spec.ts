import { mockNuxtImport } from '@nuxt/test-utils/runtime';

const { useCustomer } = vi.hoisted(() => {
    return {
        useCustomer: vi.fn().mockReturnValue({})
    }
});

mockNuxtImport('useCustomer', () => {
    return useCustomer
});


afterEach(() => {
    vi.resetAllMocks();
    vi.clearAllMocks();
});

beforeAll(() => {
    useCustomer.mockImplementation(() => {
        return {
            isGuest: ref(true)
        }
    });
});


describe('useCheckout', () => {

    it('should combine shipping and billing by default', () => {
        const { combineShippingAndBilling } = useCheckout();
        
        expect(combineShippingAndBilling.value).toBe(true);
    });

    it('should have both forms open if user is authenticated but has no addresses', () => {
        useCustomer.mockImplementation(() => {
            return {
                isGuest: ref(false)
            }
        });
        const { hasOpenForms } = useCheckout();
        
        expect(hasOpenForms.value).toBe(true);
    });

    it('should have both forms closed if user is authenticated and has addresses', () => {

    });

    it('should show form if guest user', () => {
        const { shippingOpen } = useCheckout();
        expect(shippingOpen.value).toBe(true);

    });
});