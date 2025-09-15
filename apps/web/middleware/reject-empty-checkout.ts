export default defineNuxtRouteMiddleware(async () => {
  const { cartIsEmpty } = useCart();
  const { getSession } = useCustomer();
  const localePath = useLocalePath();

  await getSession();
  if (!cartIsEmpty.value) return;
  return navigateTo(localePath(paths.cart));
});
