import { cartGetters } from '@plentymarkets/shop-sdk';

const loadPaypalScript = async () => {
  const { loadScript } = usePayPal();
  const { data: cart } = useCart();

  const currency = computed(() => cartGetters.getCurrency(cart.value) || (useAppConfig().fallbackCurrency as string));
  const paypal = await loadScript(currency.value);

  console.log('works: ', paypal);
};

export default {
  loadPaypalScript,
};
