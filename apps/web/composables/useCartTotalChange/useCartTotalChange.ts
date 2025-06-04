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
    const { $i18n } = useNuxtApp();
    const { send } = useNotification();
    const localePath = useLocalePath();
    const paypalOrder = await getOrder(route.query.orderId?.toString() || '');

    if (
      paypalOrder &&
      paypalOrder.result.purchase_units &&
      paypalOrder.result.purchase_units.length === 1 &&
      paypalOrder.result.status === 'APPROVED'
    ) {
      state.value.initialTotal = Number.parseFloat(paypalOrder.result.purchase_units[0].amount.value);
      state.value.initialCurrency = paypalOrder.result.purchase_units[0].amount.currency_code;
      state.value.changedTotal =
        cartGetters.getTotals(customerData.value.basket).total !== state.value.initialTotal ||
        cartGetters.getCurrency(customerData.value.basket) !== state.value.initialCurrency;
    } else {
      send({
        message: $i18n.t('paypal.invalidOrder'),
        type: 'warning',
      });
      await navigateTo(localePath(paths.home));
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
