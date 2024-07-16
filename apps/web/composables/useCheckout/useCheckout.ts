import { AddressType } from '@plentymarkets/shop-api';
import { PayPalAddToCartCallback } from '~/components/PayPal/types';

export const useCheckout = (cacheKey = '') => {

    const state = useState('useCheckout' + cacheKey, () => ({
        combineShippingAndBilling: true,
        init: false
    }));

    const ID_BILLING_ADDRESS = '#billing-address';
    const ID_SHIPPING_ADDRESS = '#shipping-address';
    const ID_CHECKBOX = '#terms-checkbox';


    const { hasDisplayAddress: hasShippingAddress } = useAddress(AddressType.Shipping);
    const { hasDisplayAddress: hasBillingAddress } = useAddress(AddressType.Billing);
    const { save: saveShipping, isLoading: shippingLoading, isValid: shippingValid, open: shippingOpen } = useAddressForm(AddressType.Shipping);
    const { save: saveBilling, isLoading: billingLoading, isValid: billingValid, open: billingOpen } = useAddressForm(AddressType.Billing);
    const isLoading = computed(() => shippingLoading.value || billingLoading.value);
    const isValid = computed(() => shippingValid.value && billingValid.value);
    const hasOpenForms = computed(() => (shippingOpen.value || billingOpen.value));

    const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');

    const { t } = useI18n();
    const { send } = useNotification();

    if (!state.value.init) {
        shippingOpen.value = true;
        billingOpen.value = true;
        state.value.init = true;
        if (hasBillingAddress.value) {
            state.value.combineShippingAndBilling = false;
        }
    }

    if (hasShippingAddress.value) {
        shippingOpen.value = false;
        billingOpen.value = false;
    }

    watch(hasShippingAddress, (value) => {
        if (!value) {
            shippingOpen.value = true;
        }
    })

    watch(() => state.value.combineShippingAndBilling, (value) => {
        if (!value && !hasBillingAddress.value) {
            billingOpen.value = true;
        } else {
            billingOpen.value = false;
        }
    });

    const scrollToHTMLObject = (object: string) => {
        const element = document.querySelector(object) as HTMLElement;
        const elementOffset = element?.offsetTop ?? 0;

        const headerElement = document.querySelector('header') as HTMLElement;
        const headerElementOffset = headerElement.offsetHeight ?? 0;

        window.scrollTo({
            top: elementOffset - headerElementOffset,
            behavior: 'smooth',
        });
    };

    const validateTerms = (callback?: PayPalAddToCartCallback): boolean => {
        let valid = true;
        setShowErrors(!termsAccepted.value);

        if (!termsAccepted.value) {
            scrollToHTMLObject(ID_CHECKBOX);
            valid = false;
        }

        if (callback) {
            callback(valid);
        }

        return valid;
    };

    const validateAddresses = async () => {
        if (!hasOpenForms.value) {
            return new Promise((resolve) => resolve(true));
        }
        return new Promise( async (resolve, reject) => {
            try {
                resolve(await save());
            } catch (error) {
                scrollToHTMLObject(ID_SHIPPING_ADDRESS);
                reject(false);
            }
        });
    };

    const save = async () => {

        if (state.value.combineShippingAndBilling && shippingOpen.value) {
            return saveShipping(true);
        }

        const toSave = [];

        if (shippingOpen.value) {
            toSave.push(saveShipping());
        };

        if (billingOpen.value) {
            toSave.push(saveBilling());
        }

        return Promise.all(toSave);

    }

    return {
        ...toRefs(state.value),
        save,
        validateAddresses,
        validateTerms,
        isValid,
        isLoading,
        hasOpenForms,
        shippingOpen,
        billingOpen
    };
};