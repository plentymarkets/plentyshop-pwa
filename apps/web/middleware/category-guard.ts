/**
 * This middleware is used to check if the user is authorized.
 *
 * Use this auth guard to protect routes that require the user to be logged in.
 *
 * If the user is not authorized, the user will be redirected to the login page.
 */
import { categoryGetters } from '@plentymarkets/shop-api';
export default defineNuxtRouteMiddleware(async (to) => {
  console.log('category guard middlware');
    const { getFacetsFromURL } = useCategoryFilter();
    const { isAuthorized, getSession } = useCustomer();
    const { data: productsCatalog, fetchProducts, loading, checkingGuard } = useProducts();
    const localePath = useLocalePath();
    await getSession();
    const params = getFacetsFromURL(to);
    checkingGuard.value = true;
    await fetchProducts(params);
    if (productsCatalog.value?.category) {
      if (categoryGetters.hasCustomerRight(productsCatalog.value.category) && !isAuthorized.value) {
        const targetUrl = to.fullPath;
        checkingGuard.value = false;
        return navigateTo({
          path: localePath(paths.authLogin),
          query: {
            redirect: targetUrl,
          },
        });
      }
    }
  });
  