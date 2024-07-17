import { AddressType } from '@plentymarkets/shop-api';
import { type PayPalAddToCartCallback } from '~/components/PayPal/types';
import { scrollToHTMLObject } from '~/utils/scollHelper';

const ID_SHIPPING_ADDRESS = '#shipping-address';
const ID_CHECKBOX = '#terms-checkbox';

/* eslint-disable sonarjs/cognitive-complexity */
export const useCheckout = (cacheKey = '') => {
  const state = useState('useCheckout' + cacheKey, () => ({
    combineShippingAndBilling: true,
    init: false,
  }));

  const { hasDisplayAddress: hasShippingAddress, displayAddress: displayAddressShipping, setCheckoutAddress } = useAddress(
    AddressType.Shipping,
  );
  const { hasDisplayAddress: hasBillingAddress, displayAddress: displayAddressBilling } = useAddress(
    AddressType.Billing,
  );
  const {
    save: saveShipping,
    isLoading: shippingLoading,
    isValid: shippingValid,
    open: shippingOpen,
    saveShippingAndBilling,
  } = useAddressForm(AddressType.Shipping);
  const {
    save: saveBilling,
    isLoading: billingLoading,
    isValid: billingValid,
    open: billingOpen,
  } = useAddressForm(AddressType.Billing);
  const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');

  const isLoading = computed(() => shippingLoading.value || billingLoading.value);
  const isValid = computed(() => shippingValid.value && billingValid.value);
  const hasOpenForms = computed(() => shippingOpen.value || billingOpen.value);

  onNuxtReady(() => {
    if (!state.value.init) {
      if (hasShippingAddress.value) {
        shippingOpen.value = false;
        billingOpen.value = false;
      } else {
        shippingOpen.value = true;
      }
      if (
        hasBillingAddress.value &&
        hasShippingAddress.value &&
        displayAddressShipping.value.id !== displayAddressBilling.value.id
      ) {
        state.value.combineShippingAndBilling = false;
      }
      state.value.init = true;
    }
  });

  watch(hasShippingAddress, (value) => {
    if (!value) shippingOpen.value = true;
  });

  watch(
    () => state.value.combineShippingAndBilling,
    (value) => {
      billingOpen.value = !value && !hasBillingAddress.value ? true : false;
      if (hasShippingAddress.value) {
        setCheckoutAddress(AddressType.Billing, Number(displayAddressShipping.value.id));
      }
    },
  );

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

  const save = async () => {
    const toSave = [];

    if (state.value.combineShippingAndBilling && shippingOpen.value) return saveShippingAndBilling();
    if (shippingOpen.value) toSave.push(saveShipping());
    if (billingOpen.value) toSave.push(saveBilling());

    return Promise.all(toSave);
  };

  const validateAndSaveAddresses = async () => {
    if (!hasOpenForms.value) {
      return new Promise((resolve) => resolve(true));
    }

    return new Promise((resolve, reject) => {
      save()
        .then(() => {
          return resolve(true);
        })
        .catch(() => {
          scrollToHTMLObject(ID_SHIPPING_ADDRESS);
          return reject(new Error('Failed to validate address'));
        });
    });
  };

  return {
    ...toRefs(state.value),
    save,
    validateAndSaveAddresses,
    validateTerms,
    isValid,
    isLoading,
    hasOpenForms,
    shippingOpen,
    billingOpen,
  };
};
