export default defineNuxtRouteMiddleware(async () => {
  const { cartIsEmpty } = useCart();
  const localePath = useLocalePath();

  await useFetchSession().fetchSession();
  if (!cartIsEmpty.value) return;
  return navigateTo(localePath(paths.cart));
});
