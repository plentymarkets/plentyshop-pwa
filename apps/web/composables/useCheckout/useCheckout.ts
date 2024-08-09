import { type PayPalAddToCartCallback } from '~/components/PayPal/types';
import { scrollToHTMLObject } from '~/utils/scollHelper';

const ID_CHECKBOX = '#terms-checkbox';

const save = async () => {
  /* if (state.value.combineShippingAndBilling && shippingOpen.value) return saveShippingAndBilling();
  if (shippingOpen.value) toSave.push(saveShipping());
  if (billingOpen.value) toSave.push(saveBilling()); */
};

const validateAndSaveAddresses = async () => {
  /* if (!hasOpenForms.value) {
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
  }); */
};

export const useCheckout = (cacheKey = '') => {
  const state = useState('useCheckout' + cacheKey, () => ({
    combineShippingAndBilling: true,
    init: false,
  }));

  const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');

  const validateTerms = (callback?: PayPalAddToCartCallback): boolean => {
    let valid = true;
    setShowErrors(!termsAccepted.value);

    if (!termsAccepted.value) {
      scrollToHTMLObject(ID_CHECKBOX);
      valid = false;
    }

    if (callback) callback(valid);

    return valid;
  };

  return {
    ...toRefs(state.value),
    save,
    validateAndSaveAddresses,
    validateTerms,
  };
};
