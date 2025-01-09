/**
 * This middleware is used to check if category can be accesed without being authenticatedd.
 *
 * If the user is not authenticated, the user will be redirected to the login page.
 */
import { categoryGetters } from '@plentymarkets/shop-api';
export default defineNuxtRouteMiddleware(async (to) => {
  const { getFacetsFromURL, checkFiltersInURL } = useCategoryFilter(to);
  const { setCategoriesPageMeta } = useCanonical();
  const { isAuthorized, getSession } = useCustomer();
  await getSession();
  const { data: productsCatalog, fetchProducts, checkingPermission } = useProducts();
  const localePath = useLocalePath();
  checkingPermission.value = true;
  const params = getFacetsFromURL();
  await fetchProducts(params).then(() => checkFiltersInURL());
  if (!productsCatalog.value.category) {
    throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true });
  }
  //setCategoriesPageMeta(productsCatalog.value, params);

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
