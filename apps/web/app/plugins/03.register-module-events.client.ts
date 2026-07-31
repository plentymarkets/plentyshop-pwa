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
  },
});
