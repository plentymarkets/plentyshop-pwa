import type { RouteLocationNormalized } from 'vue-router';

export const validateApiUrl = (url: string | undefined): string | undefined => {
  return url?.replace(/[/\\]+$/, '');
};

export const isPageOfType = (type: string): boolean => {
  return useRouter().currentRoute.value.meta.type === type;
};

export const isToGlobalCategoryTemplate = (to: RouteLocationNormalized) => {
  const slugParam = to.params.slug;
  const slug = Array.isArray(slugParam) ? slugParam.join('/') : String(slugParam ?? '');
  return `/${slug}` === paths.globalItemCategory;
};

export const getSearchPath = (suggestion: string) => {
  const localePath = useLocalePath();
  return `${localePath(paths.search)}?term=${encodeURIComponent(suggestion)}`;
};
