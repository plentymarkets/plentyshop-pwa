export default defineNuxtRouteMiddleware(async () => {
  const { getCart, cartIsEmpty } = useCart();
  const localePath = useLocalePath();

  await getCart();
  if (!cartIsEmpty.value) return;
  return navigateTo(localePath(paths.cart));
});
