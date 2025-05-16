import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import { object, string } from 'yup';
import type { CategoryEntry, CategoryTreeItem } from '@plentymarkets/shop-api';
import { categoryTreeGetters } from '@plentymarkets/shop-api';

export const useAddPageModal = () => {
  const { pageModalOpen, togglePageModal, setSettingsCategory } = useSiteConfiguration();
  const { data, getCategories, addNewPageToTree } = useCategoriesSearch();
  const {
    getCategoryName,
    getCategoryId,
    getParentName,
    getCurrentCategoryLevel,
    getParentCategoryId,
    getPageType,
    setCategoryId,
  } = useCategoryIdHelper();
  const router = useRouter();
  const { data: newCategory, addCategory } = useCategoryManagement();

  const _isReady = ref(false);

  const pageTypes = ref([
    { label: 'Content', value: 'content' },
    { label: 'Item category', value: 'item' },
  ]);

  const getDefaultPageType = () => {
    const type = getPageType.value;
    return pageTypes.value.find((option) => option.value === type) || pageTypes.value[0];
  };

  const pageType = ref(getDefaultPageType());

  const noneCategoryItem: CategoryTreeItem = {
    id: 0,
    type: 'none',
    itemCount: [],
    childCount: 0,
    right: 'all',
    details: [
      {
        name: 'None',
        lang: '',
        nameUrl: '',
        metaTitle: '',
        imagePath: '',
        image2Path: '',
      },
    ],
  };

  const parentPage = ref<CategoryTreeItem>(noneCategoryItem);

  const buildInitialParentPage = (): CategoryTreeItem => {
    if (getCurrentCategoryLevel.value === 6 && getParentCategoryId.value && getParentName.value) {
      return {
        ...noneCategoryItem,
        id: getParentCategoryId.value,
        details: [{ ...noneCategoryItem.details[0], name: getParentName.value }],
      };
    }

    if (getCategoryId.value && getCategoryName.value) {
      return {
        ...noneCategoryItem,
        id: getCategoryId.value,
        details: [{ ...noneCategoryItem.details[0], name: getCategoryName.value }],
      };
    }

    return noneCategoryItem;
  };

  const categoriesWithFallback = computed(() => {
    const selected = parentPage.value;
    const entries = data.value.entries || [];

    const exists = entries.some((entry) => entry.id === selected?.id);
    const merged = exists ? entries : [selected, ...entries];

    return [noneCategoryItem, ...merged.filter((e) => e.id !== 0)];
  });

  const initializeModalState = async () => {
    _isReady.value = false;
    resetForm();
    pageType.value = getDefaultPageType();
    parentPage.value = buildInitialParentPage();
    await getCategories({
      type: 'in:item,content',
      sortBy: 'position_asc,name_asc',
      with: 'details,clients',
    });
    _isReady.value = true;
  };

  watch(
    () => pageModalOpen.value,
    async (isOpen) => {
      if (isOpen) {
        await initializeModalState();
      }
    },
  );

  const validationSchema = toTypedSchema(
    object({
      pageName: string().required('Enter a page name').default(''),
    }),
  );

  const { errors, meta, defineField, handleSubmit, resetForm } = useForm({
    validationSchema,
  });

  const [pageName, pageNameAttributes] = defineField('pageName');

  const getLabel = (option: CategoryTreeItem) => {
    return option.details && option.details.length ? option.details[0].name : '';
  };

  const createNewPage = async () => {
    if (!meta.value.valid) return;

    await addCategory({
      name: pageName?.value || '',
      type: pageType.value.value,
      parentCategoryId: categoryTreeGetters.getId(parentPage.value) || null,
    });

    addNewPageToTree(newCategory.value);
    await redirectToNewPage(newCategory.value);
  };
  const redirectToNewPage = async (newCategory: CategoryEntry) => {
    await router.push({
      path: newCategory.details[0].nameUrl,
    });
    setCategoryId({
      id: newCategory.id,
      parentId: newCategory.parentCategoryId,
      name: newCategory.details[0].name,
      path: newCategory.details[0].nameUrl,
    });
    setSettingsCategory({} as CategoryTreeItem, 'general-menu');
  };
  const closeModal = () => {
    resetForm();
    togglePageModal(false);
  };

  const debouncedSearch = debounce(async (query: string) => {
    if (!query || query.length < 2) return;
    await getCategories({
      type: 'in:item,content',
      sortBy: 'position_asc,name_asc',
      with: 'details,clients',
      name: `like:${query}`,
    });
  }, 500);

  const handleSearch = (query: string) => {
    debouncedSearch(query);
  };

  const onSubmit = handleSubmit(() => createNewPage());

  return {
    pageModalOpen,
    pageName,
    pageNameAttributes,
    pageType,
    parentPage,
    pageTypes,
    categoriesWithFallback,
    _isReady,
    errors,
    onSubmit,
    closeModal,
    getLabel,
    handleSearch,
  };
};
