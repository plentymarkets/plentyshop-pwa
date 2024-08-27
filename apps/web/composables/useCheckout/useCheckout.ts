import { type Address, AddressType, cartGetters, userAddressGetters } from '@plentymarkets/shop-api';
import { type PayPalAddToCartCallback } from '~/components/PayPal/types';
import { scrollToHTMLObject } from '~/utils/scollHelper';

const ID_CHECKBOX = '#terms-checkbox';
const ID_SHIPPING_ADDRESS = '#shipping-address';
const ID_BILLING_ADDRESS = '#billing-address';

export const useCheckout = (cacheKey = '') => {
  const state = useState('useCheckout' + cacheKey, () => ({
    combineShippingAndBilling: true,
    init: false,
  }));

  const { data: cart, getCart, clearCartItems, loading: cartLoading } = useCart();
  const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
  const { addresses: shippingAddresses, get: getShipping } = useAddressStore(AddressType.Shipping);
  const { addresses: billingAddresses, get: getBilling } = useAddressStore(AddressType.Billing);
  const { add: showNewShippingForm, open: editingShippingAddress } = useAddressForm(AddressType.Shipping);
  const { add: showNewBillingForm, open: editingBillingAddress } = useAddressForm(AddressType.Billing);
  const { set: setShippingCheckout, hasCheckoutAddress: hasShippingAddress } = useCheckoutAddress(AddressType.Shipping);
  const { set: setBillingCheckout, hasCheckoutAddress: hasBillingAddress } = useCheckoutAddress(AddressType.Billing);

  const anyAddressFormIsOpen = computed(
    () =>
      showNewShippingForm.value ||
      editingShippingAddress.value ||
      showNewBillingForm.value ||
      editingBillingAddress.value,
  );

  const backToFormEditing = () => {
    const classList = ['bg-primary-50', 'rounded-md'];
    const opacityClass = 'opacity-0';
    const targetId =
      showNewShippingForm.value || editingShippingAddress.value ? ID_SHIPPING_ADDRESS : ID_BILLING_ADDRESS;

    const targetElement = document.querySelector(targetId);
    const firstDivider = document.querySelector('#top-billing-divider');
    const secondDivider = document.querySelector(
      targetId === ID_SHIPPING_ADDRESS ? '#top-shipping-divider' : '#bottom-billing-divider',
    );

    scrollToHTMLObject(targetId);

    targetElement?.classList.add(...classList);
    [firstDivider, secondDivider].forEach((divider) => divider?.classList.add(opacityClass));

    setTimeout(() => {
      targetElement?.classList.remove(...classList);
      [firstDivider, secondDivider].forEach((divider) => divider?.classList.remove(opacityClass));
    }, 1000);

    return false;
  };

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

  const persistShippingAddress = () => {
    const cartAddress = ref();
    const cartShippingAddressId = cartGetters.getCustomerShippingAddressId(cart.value);
    const primaryAddress =
      shippingAddresses.value.length > 0 ? userAddressGetters.getDefault(shippingAddresses.value) : undefined;

    if (cartShippingAddressId) cartAddress.value = getShipping(cartShippingAddressId);
    if (cartAddress.value || primaryAddress)
      setShippingCheckout(cartAddress.value ?? (primaryAddress as Address), cartAddress.value !== undefined);
  };

  const persistBillingAddress = () => {
    const cartAddress = ref();
    const cartBillingAddressId = cartGetters.getCustomerInvoiceAddressId(cart.value);
    const primaryAddress =
      billingAddresses.value.length > 0 ? userAddressGetters.getDefault(billingAddresses.value) : undefined;

    if (cartBillingAddressId) cartAddress.value = getBilling(cartBillingAddressId);

    if (cartAddress.value || primaryAddress)
      setBillingCheckout(cartAddress.value ?? (primaryAddress as Address), cartAddress.value !== undefined);
  };

  return {
    ...toRefs(state.value),
    cart,
    getCart,
    clearCartItems,
    cartLoading,
    anyAddressFormIsOpen,
    persistShippingAddress,
    hasShippingAddress,
    persistBillingAddress,
    hasBillingAddress,
    backToFormEditing,
    validateTerms,
  };
};
