import { cartGetters } from '@plentymarkets/shop-api';

export const useShippingAsBilling = () => {
  const route = useRoute();
  const localePath = useLocalePath();
  const { data: customerData } = useCustomer();
  const { getCart } = useCart();
  const { getOrder } = usePayPal();

  const state = useState('useShippingAsBilling', () => ({
    restrictedAddresses: route.fullPath.includes(localePath(paths.readonlyCheckout)),
    shippingAsBilling: false,
    initialTotal: '0',
    changedTotal: false,
  }));

  const setInitialCartTotal = async () => {
    const paypalOrder = await getOrder({
      paypalOrderId: route.query.orderId?.toString() || '',
      payPalPayerId: route.query.payerId?.toString() || '',
    });

    if (paypalOrder) {
      state.value.initialTotal = paypalOrder.result.purchase_units[0].amount.value;
    }

    state.value.changedTotal =
      cartGetters.getTotals(customerData.value.basket).total.toString() !== state.value.initialTotal;
  };

  const handleCartTotalChanges = async () => {
    if (state.value.restrictedAddresses) {
      state.value.changedTotal =
        cartGetters.getTotals(customerData.value.basket).total.toString() !== state.value.initialTotal;
      await getCart();
    }
  };

  return {
    setInitialCartTotal,
    handleCartTotalChanges,
    ...toRefs(state.value),
  };
};
