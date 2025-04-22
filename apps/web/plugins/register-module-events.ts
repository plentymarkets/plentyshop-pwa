export default defineNuxtPlugin(async () => {
  const { on: onPlentyEvent } = usePlentyEvent();

  onPlentyEvent('module:clearCart', async () => {
    const { deleteCart } = useCart();
    await deleteCart();
  });
});
