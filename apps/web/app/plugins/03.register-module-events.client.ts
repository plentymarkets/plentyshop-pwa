export default defineNuxtPlugin({
  name: 'register-module-events',
  parallel: true,
  setup() {
    const { on: onPlentyEvent } = usePlentyEvent();

    onPlentyEvent('module:clearCart', async () => {
      const { deleteCart } = useCart();
      await deleteCart();
    });

    onPlentyEvent('backend:CheckoutChanged', (data) => {
      const { setShippingMethods } = useCartShippingMethods();
      const { setPaymentMethods } = usePaymentMethods();

      setShippingMethods(data.checkout.shippingProfileList, data.checkout.shippingProfileId ?? -1);
      setPaymentMethods(data.checkout.paymentDataList, data.checkout.methodOfPaymentId ?? -1);
    });

    onPlentyEvent('backend:AfterBasketChanged', (data) => {
      const { data: cart } = useCart();
      const selectedPaymentId = cart.value?.methodOfPaymentId ?? 0;

      if (cart.value && data.basket) {
        cart.value = deepMergeExisting(cart.value, data.basket);
      }

      if (selectedPaymentId > 0 && cart.value?.methodOfPaymentId !== selectedPaymentId) {
        const { send } = useNotification();
        send({ message: t('billing.methodChanged'), type: 'warning' });
      }
    });
  },
});
