export default defineNuxtPlugin(async () => {
  const { on: onPlentyEvent } = usePlentyEvent();

  onPlentyEvent('module:clearCart', () => {
    const { clearCartItems } = useCart();
    clearCartItems();
  });
});
