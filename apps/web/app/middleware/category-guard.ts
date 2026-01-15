/**
 * This middleware is used to check if category can be accesed without being authenticated.
 *
 * If the user is not authenticated, the user will be redirected to the login page.
 */
import { categoryTreeGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';

const pathCategoryMap = new Map<string, CategoryTreeItem>();
let cachedTreeReference: CategoryTreeItem[] | null = null;

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: categoryTree } = useCategoryTree();

  if (!categoryTree.value?.length) return;

  const localePath = useLocalePath();
  const { buildCategoryMenuLink } = useLocalization();
  const { isAuthorized } = useCustomer();

  if (cachedTreeReference !== categoryTree.value) {
    pathCategoryMap.clear();
    cachedTreeReference = categoryTree.value;

    const buildPathMap = (items: CategoryTreeItem[]) => {
      for (const item of items) {
        pathCategoryMap.set(localePath(buildCategoryMenuLink(item, categoryTree.value)), item);
        if (item.children?.length) buildPathMap(item.children);
      }
    };

    buildPathMap(categoryTree.value);
  }

  const category = pathCategoryMap.get(to.path);

  if (category && !isAuthorized.value && categoryTreeGetters.getCategoryRight(category) === 'customer') {
    return navigateTo({
      path: localePath(paths.authLogin),
      query: { redirect: to.fullPath },
    });
  }
});
