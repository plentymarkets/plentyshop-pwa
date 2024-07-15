import { AddressType } from '@plentymarkets/shop-api';
import { PayPalAddToCartCallback } from '~/components/PayPal/types';

export const useCheckout = (cacheKey = '') => {

    const state = useState('useCheckout' + cacheKey, () => ({
        combineShippingAndBilling: true,
        init: false
    }));

    const ID_BILLING_ADDRESS = '#billing-address';
    const ID_SAVE_ADDRESS = '#save-address';
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
        return new Promise((resolve, reject) => {
            if (hasOpenForms.value) {
                try {
                    save()
                        .then((isValid) => {
                            if (!isValid) {
                                console.log('not valid reject');
                                scrollToHTMLObject(ID_SHIPPING_ADDRESS);
                                reject(false);
                            } else {
                                resolve(true);
                            }
                        }).catch(() =>
                            reject(false)
                        )
                } catch (error) {
                    reject(false);
                }
            } else {
                if (!hasShippingAddress.value) {
                    send({
                        type: 'negative',
                        message: t('billingAddressRequired'),
                    });
                    scrollToHTMLObject(ID_BILLING_ADDRESS);
                    reject(false);
                } else if (!hasBillingAddress.value) {
                    send({
                        type: 'negative',
                        message: t('shippingAddressRequired'),
                    });
                    scrollToHTMLObject(ID_SHIPPING_ADDRESS);
                    reject(false);
                } else {
                    resolve(true);
                }
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