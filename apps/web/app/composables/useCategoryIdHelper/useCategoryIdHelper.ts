import type { CategoryDetails } from '@plentymarkets/shop-api/lib/types/api/category';

const currentCategoryId = ref<number>();
const currentParentCategoryId = ref<number | null>(null);
const currentCategoryName = ref<string | null>(null);
const currentCategoryPath = ref<string | null>(null);
const currentPageType = ref<string | null>(null);
const currentPageHasChildren = ref<boolean | null>(null);
const currentCategoryLevel = ref<number | null>(null);
const currentParentName = ref<string | null>(null);
const currentCategoryPreviewUrl = ref<string | null>(null);
const currentCategoryDetails = ref<CategoryDetails[]>([]);

export const useCategoryIdHelper = () => {
  const setCategoryId = ({
    id,
    parentId,
    name,
    path,
    level,
    previewUrl,
    details,
  }: {
    id?: number;
    parentId?: number;
    name?: string;
    path?: string;
    level?: number;
    previewUrl?: string;
    details?: CategoryDetails[];
  }) => {
    currentCategoryId.value = id;
    if (parentId !== undefined) {
      currentParentCategoryId.value = parentId;
    }
    if (name !== undefined) {
      currentCategoryName.value = name;
    }
    if (path !== undefined) {
      currentCategoryPath.value = path;
    }
    if (level !== undefined) {
      currentCategoryLevel.value = level;
    }
    if (previewUrl !== undefined) {
      currentCategoryPreviewUrl.value = previewUrl;
    }
    if (details !== undefined) {
      currentCategoryDetails.value = details;
    }
  };
  const setPageType = (pageType?: string) => {
    if (pageType !== undefined) {
      currentPageType.value = pageType;
    }
  };

  const setParentName = (name: string) => {
    currentParentName.value = name;
  };
  const setPageHasChildren = (hasChildren: boolean) => {
    currentPageHasChildren.value = hasChildren;
  };

  const getCategoryId = computed(() => currentCategoryId.value);
  const getParentCategoryId = computed(() => currentParentCategoryId.value);
  const getCategoryName = computed(() => currentCategoryName.value);
  const getCategoryPath = computed(() => currentCategoryPath.value);
  const getPageType = computed(() => currentPageType.value);
  const getPageHasChildren = computed(() => currentPageHasChildren.value);
  const getCurrentCategoryLevel = computed(() => currentCategoryLevel.value);
  const getParentName = computed(() => currentParentName.value);
  const getCategoryPreviewPath = computed(() => {
    const previewUrl = currentCategoryPreviewUrl.value;
    if (!previewUrl) return '/';
    const correctedPreviewUrl = getCorrectPreviewPathWithLocale(previewUrl);
    const firstSlashIndex = correctedPreviewUrl.indexOf('/', 8);
    return firstSlashIndex !== -1 ? correctedPreviewUrl.slice(firstSlashIndex) : '/';
  });
  const getCategoryDetails = computed(() => currentCategoryDetails.value);
  const getCorrectPreviewPathWithLocale = (path: string): string => {
    const { $i18n } = useNuxtApp();
    const { locale, defaultLocale, strategy } = $i18n;
    const localeIndex = path.indexOf(locale.value);

    const shouldAddLocale = (strategy: string, locale: string, defaultLocale: string) => {
      if (strategy === 'prefix') return true;
      if (strategy === 'prefix_except_default') return locale !== defaultLocale;
      if (strategy === 'prefix_and_default') return true;
      return false;
    };

    if (shouldAddLocale(strategy, locale.value, defaultLocale)) {
      return path.slice(localeIndex - 1);
    }

    return path.slice(localeIndex + locale.value.length);
  };

  return {
    setCategoryId,
    setPageType,
    setPageHasChildren,
    getCategoryId,
    getParentCategoryId,
    getCategoryName,
    getCategoryPath,
    getPageType,
    getPageHasChildren,
    getCurrentCategoryLevel,
    setParentName,
    getParentName,
    getCategoryPreviewPath,
    getCategoryDetails,
    getCorrectPreviewPathWithLocale,
  };
};
