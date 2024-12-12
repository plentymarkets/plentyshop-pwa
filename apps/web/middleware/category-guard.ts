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
    const { isAuthorized, getSession } = useCustomer();
    const { data: productsCatalog, loading } = useProducts();

    const localePath = useLocalePath();
    console.log('loading state');
    console.log(loading.value);

    await getSession();
    // Fetch category is made only after this middlware is called.So accessing getter is problematic.
    console.log(productsCatalog.value?.category)
    
    if(productsCatalog.value?.category) {
      console.log(categoryGetters.hasCustomerRight(productsCatalog.value.category))
    }


    if (productsCatalog.value?.category) {
      if (categoryGetters.hasCustomerRight(productsCatalog.value.category) && !isAuthorized.value) {
        const targetUrl = to.fullPath;
        return navigateTo({
          path: localePath(paths.authLogin),
          query: {
            redirect: targetUrl,
          },
        });
      }
    }
  });
  