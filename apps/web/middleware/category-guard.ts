/**
 * This middleware is used to check if category can be accesed without being authenticated.
 *
 * If the user is not authenticated, the user will be redirected to the login page.
 */
import { categoryTreeGetters, type CategoryTreeItem } from '@plentymarkets/shop-api';

export default defineNuxtRouteMiddleware(async (to) => {
  const { data: categoryTree } = useCategoryTree();
  const localePath = useLocalePath();
  const { buildCategoryMenuLink } = useLocalization();
  const { isAuthorized } = useCustomer();

  const findCategoryByPath = (items: CategoryTreeItem[], targetPath: string): CategoryTreeItem => {
    for (const item of items) {
      if (localePath(buildCategoryMenuLink(item, categoryTree.value)) === targetPath) {
        return item;
      }

      if (item.children?.length) {
        const found = findCategoryByPath(item.children, targetPath);
        if (Object.keys(found).length) return found;
      }
    }
    return {} as CategoryTreeItem;
  };

  const category = findCategoryByPath(categoryTree.value, to.path);

  if (category && categoryTreeGetters.getCategoryRight(category) === 'customer' && !isAuthorized.value) {
    const targetUrl = to.fullPath;
    return navigateTo({
      path: localePath(paths.authLogin),
      query: { redirect: targetUrl },
    });
  }
});
