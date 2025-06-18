import type { CategoryDetails } from '@plentymarkets/shop-api/lib/types/api/category';

const currentCategoryId = ref<number>();
const currentParentCategoryId = ref<number | null>(null);
const currentCategoryName = ref<string | null>(null);
const currentCategoryPath = ref<string | null>(null);
const currentPageType = ref<string | null>(null);
const currentPageHasChildren = ref<boolean | null>(null);
const currentCategoryLevel = ref<number | null>(null);
const currentParentName = ref<string | null>(null);
const currentCategoryDetails = ref<CategoryDetails[]>([]);

export const useCategoryIdHelper = () => {
  const setCategoryId = ({
    id,
    parentId,
    name,
    path,
    level,
    details,
  }: {
    id?: number;
    parentId?: number;
    name?: string;
    path?: string;
    level?: number;
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
  const getCategoryDetails = computed(() => currentCategoryDetails.value);

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
    getCategoryDetails,
  };
};
