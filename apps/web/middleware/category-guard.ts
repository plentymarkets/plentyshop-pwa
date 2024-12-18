/**
 * This middleware is used to check if the user is authorized.
 *
 * Use this auth guard to protect routes that require the user to be logged in.
 *
 * If the user is not authorized, the user will be redirected to the login page.
 */
import { categoryGetters } from '@plentymarkets/shop-api';
export default defineNuxtRouteMiddleware(async (to) => {
  const { getFacetsFromURL } = useCategoryFilter(to);
  const { setCategoriesPageMeta } = useCanonical();
  const { isAuthorized, getSession } = useCustomer();
  const { data: productsCatalog, fetchProducts, loading, checkingPermission } = useProducts();
  const localePath = useLocalePath();
  await getSession();
  checkingPermission.value = true;
  const params = getFacetsFromURL();
  await fetchProducts(params);
  if (!productsCatalog.value.category) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }
  setCategoriesPageMeta(productsCatalog.value, params);

  const category = productsCatalog.value?.category;
  if (category && categoryGetters.hasCustomerRight(category) && !isAuthorized.value) {
    const targetUrl = to.fullPath;
    return navigateTo({
      path: localePath(paths.authLogin),
      query: { redirect: targetUrl },
    });
  }
  checkingPermission.value = false;
});
