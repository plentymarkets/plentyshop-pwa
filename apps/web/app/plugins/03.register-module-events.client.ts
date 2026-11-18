import type { CartItem } from '@plentymarkets/shop-api';

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

      if (cart.value && data.basket) {
        cart.value = deepMergeExisting(cart.value, data.basket);
      }

      // Cart items can change if the AfterBasketChanged event is triggered by a backend response.
      if (cart.value && data.basketItems) {
        cart.value.items = mergeCartItems(cart.value.items, data.basketItems as unknown as CartItem[]);
      }
    });
  },
});
