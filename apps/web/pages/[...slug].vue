<template>
  <NuxtLayout
    name="default"
    :breadcrumbs="breadcrumbs"
    class="relative"
    :class="{ 'pointer-events-none opacity-50': loading }"
  >
    <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
    <template v-if="isEditablePage">
      <EditablePage :identifier="categoryGetters.getId(productsCatalog.category)" :type="'category'" />
    </template>
    <template v-else>
      <UiButton variant="tertiary" class="md:hidden whitespace-nowrap" @click="open">
        <template #prefix>
          <SfIconTune />
        </template>
        {{ t('listSettings') }}
      </UiButton>

      <CategoryPageContent
        v-if="productsCatalog?.products"
        :title="categoryGetters.getCategoryName(productsCatalog.category)"
        :total-products="productsCatalog.pagination.totals"
        :products="productsCatalog.products"
        :items-per-page="Number(productsPerPage)"
      >
        <template #sidebar>
          <BlocksSortFilter v-bind="sortFilter" />
        </template>
      </CategoryPageContent>
    </template>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { categoryGetters, categoryTreeGetters, facetGetters } from '@plentymarkets/shop-api';
import { SfIconTune, SfLoaderCircular, useDisclosure } from '@storefront-ui/vue';

definePageMeta({ layout: false, middleware: ['category-guard'], type: 'category' });

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const { setCategoriesPageMeta } = useCanonical();
const { setBlocksListContext } = useBlockManager();
const { getFacetsFromURL, checkFiltersInURL } = useCategoryFilter();
const { fetchProducts, data: productsCatalog, productsPerPage, loading } = useProducts();
const { data: categoryTree } = useCategoryTree();
const { open } = useDisclosure();
const { getSortFilterCategoryTemplateBlock } = useCategoryTemplate();

const sortFilter = getSortFilterCategoryTemplateBlock();

const { buildCategoryLanguagePath } = useLocalization();
const { isEditablePage } = useToolbar();

const breadcrumbs = computed(() => {
  if (productsCatalog.value.category) {
    const breadcrumb = categoryTreeGetters.generateBreadcrumbFromCategory(
      categoryTree.value,
      categoryGetters.getId(productsCatalog.value.category),
    );
    breadcrumb.unshift({ name: t('home'), link: '/' });

    return breadcrumb;
  }

  return [];
});

const canonicalDb = productsCatalog.value.category?.details[0].canonicalLink;

const handleQueryUpdate = async () => {
  await fetchProducts(getFacetsFromURL()).then(() => checkFiltersInURL());

  if (!productsCatalog.value.category) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found',
    });
  }
};

await handleQueryUpdate().then(() => {
  setCategoriesPageMeta(productsCatalog.value, getFacetsFromURL(), canonicalDb);
  setBlocksListContext(
    categoryTreeGetters.findCategoryById(categoryTree.value, categoryGetters.getId(productsCatalog.value.category))
      ?.type === 'item'
      ? 'productCategory'
      : 'content',
  );
});

const { setPageMeta } = usePageMeta();
const categoryName = computed(() => categoryGetters.getCategoryName(productsCatalog.value.category));
const icon = 'sell';
setPageMeta(categoryName.value, icon);

watch(
  () => locale.value,
  (changedLocale: string) => {
    router.push({
      path: buildCategoryLanguagePath(`${productsCatalog.value.languageUrls[changedLocale]}`),
      query: route.query,
    });
  },
);

const headTitle = computed(() =>
  productsCatalog.value?.category
    ? ((categoryGetters.getMetaTitle(productsCatalog.value.category) || process.env.METATITLE) ?? '')
    : (process.env.METATITLE ?? ''),
);

const descriptionContent = computed(() =>
  productsCatalog.value?.category
    ? ((categoryGetters.getMetaDescription(productsCatalog.value.category) || process.env.METADESC) ?? '')
    : (process.env.METADESC ?? ''),
);

const keywordsContent = computed((): string =>
  productsCatalog.value?.category
    ? ((categoryGetters.getMetaKeywords(productsCatalog.value.category) || process.env.METAKEYWORDS) ?? '')
    : (process.env.METAKEYWORDS ?? ''),
);

const robotsContent = computed((): string =>
  productsCatalog.value?.category ? categoryGetters.getCategoryRobots(productsCatalog.value.category) : '',
);

watch(
  () => route.query,
  async () => {
    await handleQueryUpdate().then(() => setCategoriesPageMeta(productsCatalog.value, getFacetsFromURL()));
  },
);

watchEffect(() => {
  route.meta.isBlockified = isEditablePage;
});

useHead({
  title: headTitle,
  meta: [
    { name: 'description', content: descriptionContent },
    { name: 'keywords', content: keywordsContent },
    { name: 'robots', content: robotsContent },
  ],
});
</script>
