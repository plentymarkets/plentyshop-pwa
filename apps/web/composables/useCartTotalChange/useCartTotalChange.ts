import { cartGetters } from '@plentymarkets/shop-api';

export const useCartTotalChange = () => {
  const route = useRoute();
  const { data: customerData, isGuest, isAuthorized } = useCustomer();
  const { getCart } = useCart();
  const { getOrder } = usePayPal();
  const { restrictedAddresses } = useRestrictedAddress();

  const state = useState('useCartTotalChange', () => ({
    initialTotal: 0,
    initialCurrency: '',
    changedTotal: false,
  }));

  const setInitialCartTotal = async () => {
    const paypalOrder = await getOrder({
      paypalOrderId: route.query.orderId?.toString() || '',
      payPalPayerId: route.query.payerId?.toString() || '',
    });

    if (paypalOrder) {
      state.value.initialTotal = Number.parseFloat(paypalOrder.result.purchase_units[0].amount.value);
      state.value.initialCurrency = paypalOrder.result.purchase_units[0].amount.currency_code;
      state.value.changedTotal =
        cartGetters.getTotals(customerData.value.basket).total !== state.value.initialTotal ||
        cartGetters.getCurrency(customerData.value.basket) !== state.value.initialCurrency;
    }
  };

  const handleCartTotalChanges = async () => {
    if (restrictedAddresses.value || isGuest.value || isAuthorized.value) await getCart();

    if (restrictedAddresses.value) {
      state.value.changedTotal =
        cartGetters.getTotals(customerData.value.basket).total !== state.value.initialTotal ||
        cartGetters.getCurrency(customerData.value.basket) !== state.value.initialCurrency;
    }
  };

  return {
    setInitialCartTotal,
    handleCartTotalChanges,
    ...toRefs(state.value),
  };
};
