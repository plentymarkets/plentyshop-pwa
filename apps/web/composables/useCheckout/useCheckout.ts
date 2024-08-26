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

  const showBuyDialog = ref(false);
  const { data: cart, getCart, clearCartItems, loading: cartLoading } = useCart();
  const { checkboxValue: termsAccepted, setShowErrors } = useAgreementCheckbox('checkoutGeneralTerms');
  const { addresses: shippingAddresses, get: getShipping } = useAddressStore(AddressType.Shipping);
  const { addresses: billingAddresses, get: getBilling } = useAddressStore(AddressType.Billing);
  const { set: setShippingCheckoutAddress, hasCheckoutAddress: hasShippingAddress } = useCheckoutAddress(
    AddressType.Shipping,
  );
  const { set: setBillingCheckoutAddress, hasCheckoutAddress: hasBillingAddress } = useCheckoutAddress(
    AddressType.Billing,
  );

  const {
    addressToEdit: shippingAddressToEdit,
    add: showNewShippingForm,
    open: editingShippingAddress,
  } = useAddressForm(AddressType.Shipping);

  const {
    addressToEdit: billingAddressToEdit,
    add: showNewBillingForm,
    open: editingBillingAddress,
  } = useAddressForm(AddressType.Billing);

  const anyAddressFormIsOpen = computed(
    () =>
      showNewShippingForm.value ||
      editingShippingAddress.value ||
      showNewBillingForm.value ||
      editingBillingAddress.value,
  );

  const keepEditing = () => {
    showBuyDialog.value = false;

    scrollToHTMLObject(
      showNewShippingForm.value || editingShippingAddress.value ? ID_SHIPPING_ADDRESS : ID_BILLING_ADDRESS,
    );
  };

  const closeFormsAndProceed = () => {
    if (showNewShippingForm.value) showNewShippingForm.value = false;
    if (showNewBillingForm.value) showNewBillingForm.value = false;

    if (editingShippingAddress.value) {
      editingShippingAddress.value = false;
      shippingAddressToEdit.value = {} as Address;
    }

    if (editingBillingAddress.value) {
      editingBillingAddress.value = false;
      billingAddressToEdit.value = {} as Address;
    }

    showBuyDialog.value = false;
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
      setShippingCheckoutAddress(cartAddress.value ?? (primaryAddress as Address), cartAddress.value !== undefined);
  };

  const persistBillingAddress = () => {
    const cartAddress = ref();
    const cartBillingAddressId = cartGetters.getCustomerInvoiceAddressId(cart.value);
    const primaryAddress =
      billingAddresses.value.length > 0 ? userAddressGetters.getDefault(billingAddresses.value) : undefined;

    if (cartBillingAddressId) cartAddress.value = getBilling(cartBillingAddressId);

    if (cartAddress.value || primaryAddress)
      setBillingCheckoutAddress(cartAddress.value ?? (primaryAddress as Address), cartAddress.value !== undefined);
  };

  return {
    ...toRefs(state.value),
    cart,
    getCart,
    clearCartItems,
    cartLoading,
    showBuyDialog,
    anyAddressFormIsOpen,
    persistShippingAddress,
    hasShippingAddress,
    persistBillingAddress,
    hasBillingAddress,
    keepEditing,
    closeFormsAndProceed,
    validateTerms,
  };
};
