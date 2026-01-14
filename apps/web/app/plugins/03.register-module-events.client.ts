export default defineNuxtPlugin({
  parallel: true,
  setup() {
    const { on: onPlentyEvent } = usePlentyEvent();

    onPlentyEvent('module:clearCart', async () => {
      const { deleteCart } = useCart();
      await deleteCart();
    });
  },
});
