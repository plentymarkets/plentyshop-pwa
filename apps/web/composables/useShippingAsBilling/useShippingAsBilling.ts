import { cartGetters } from '@plentymarkets/shop-api';

export const useShippingAsBilling = () => {
  const route = useRoute();
  const localePath = useLocalePath();
  const { data: customerData } = useCustomer();
  const { getCart } = useCart();

  const state = useState('useShippingAsBilling', () => ({
    restrictedAddresses: route.fullPath.includes(localePath(paths.readonlyCheckout)),
    shippingAsBilling: false,
    initialTotal: 0,
    changedTotal: false,
  }));

  const setInitialCartTotal = () => {
    state.value.initialTotal = cartGetters.getTotals(customerData.value.basket).total;
  };

  const handleCartTotalChanges = async () => {
    if (state.value.restrictedAddresses) {
      state.value.changedTotal = cartGetters.getTotals(customerData.value.basket).total !== state.value.initialTotal;
      await getCart();
    }
  };

  return {
    setInitialCartTotal,
    handleCartTotalChanges,
    ...toRefs(state.value),
  };
};
