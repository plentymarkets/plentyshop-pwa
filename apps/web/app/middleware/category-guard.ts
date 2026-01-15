/**
 * This middleware is used to check if category can be accesed without being authenticated.
 *
 * If the user is not authenticated, the user will be redirected to the login page.
 */
import { categoryTreeGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';

const pathCategoryCache = new Map<string, CategoryTreeItem>();
let cachedTreeReference: CategoryTreeItem[] | null = null;

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: categoryTree } = useCategoryTree();

  if (!categoryTree.value?.length) return;

  const localePath = useLocalePath();
  const { buildCategoryMenuLink } = useLocalization();
  const { isAuthorized } = useCustomer();

  if (cachedTreeReference !== categoryTree.value) {
    pathCategoryCache.clear();
    cachedTreeReference = categoryTree.value;
  }

  const findCategoryByPath = (items: CategoryTreeItem[], targetPath: string): CategoryTreeItem | null => {
    const cached = pathCategoryCache.get(targetPath);
    if (cached) return cached;

    for (const item of items) {
      if (localePath(buildCategoryMenuLink(item, categoryTree.value)) === targetPath) {
        pathCategoryCache.set(targetPath, item);
        return item;
      }

      if (item.children?.length) {
        const found = findCategoryByPath(item.children, targetPath);
        if (found) {
          pathCategoryCache.set(targetPath, found);
          return found;
        }
      }
    }

    return null;
  };

  const category = findCategoryByPath(categoryTree.value, to.path);

  if (category && !isAuthorized.value && categoryTreeGetters.getCategoryRight(category) === 'customer') {
    return navigateTo({
      path: localePath(paths.authLogin),
      query: { redirect: to.fullPath },
    });
  }
});
