export default defineNuxtRouteMiddleware(async () => {
  const { getCart, cartIsEmpty } = useCart();

  await getCart();
  if (!cartIsEmpty.value) return;
  return navigateTo(useLocalePath()(paths.cart));
});
