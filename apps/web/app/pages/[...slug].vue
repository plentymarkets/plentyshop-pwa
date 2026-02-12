<template>
  <NuxtLayout
    name="default"
    :breadcrumbs="breadcrumbs"
    class="relative"
    :class="{ 'pointer-events-none opacity-50': loading }"
  >
    <template v-if="hasHeaderBlocks" #header>
      <EditablePage :identifier="actualIdentifier" type="category" area="header" prevent-blocks-request />
    </template>

    <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />

    <EditablePage
      :identifier="actualIdentifier"
      type="category"
      area="main"
      data-testid="category-page-content"
      prevent-blocks-request
    />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { categoryGetters, categoryTreeGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { Locale } from '#i18n';
defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});
const { locale } = useI18n();
const route = useRoute();
const router = useRouter();
const { setCategoriesPageMeta } = useUrlPageMeta();
const { setBlocksListContext } = useBlocksList();
const { getFacetsFromURL, checkFiltersInURL } = useCategoryFilter();
const { fetchProducts, data: productsCatalog, loading } = useProducts();
const { data: categoryTree } = useCategoryTree();
const { buildCategoryLanguagePath } = useLocalization();

const identifier = computed(() =>
  productsCatalog.value.category?.type === 'content' ? productsCatalog.value.category?.id : 0,
);

definePageMeta({
  layout: false,
  middleware: ['category-guard'],
  type: 'category',
  isBlockified: true,
  identifier: 0,
});

const breadcrumbs = computed(() => {
  if (productsCatalog.value.category) {
    const breadcrumb = categoryTreeGetters.generateBreadcrumbFromCategory(
      categoryTree.value,
      categoryGetters.getId(productsCatalog.value.category),
    );
    breadcrumb.unshift({ name: t('common.labels.home'), link: '/' });

    return breadcrumb;
  }

  return [];
});

const canonicalDb = productsCatalog.value.category?.details?.[0]?.canonicalLink;

const handleQueryUpdate = async () => {
  await fetchProducts(getFacetsFromURL());
  checkFiltersInURL();

  if (!productsCatalog.value.category) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page not found',
    });
  }
};

await handleQueryUpdate();
setCategoriesPageMeta(productsCatalog.value, getFacetsFromURL(), canonicalDb);
setBlocksListContext(productsCatalog.value.category.type === 'item' ? 'productCategory' : 'content');

const { setPageMeta } = usePageMeta();
const categoryName = computed(() => categoryGetters.getCategoryName(productsCatalog.value.category));
const icon = 'sell';
setPageMeta(categoryName.value, icon);

const { $i18n } = useNuxtApp();
const actualIdentifier = ref(identifier.value);

const { data, getBlocksServer, headerBlocks } = useCategoryTemplate(
  actualIdentifier.value.toString(),
  'category',
  $i18n.locale.value,
);

const hasHeaderBlocks = computed(() => headerBlocks.value.length > 0);

if (productsCatalog.value.category?.type !== 'item') await getBlocksServer(actualIdentifier.value, 'category');

const { ensureAllGlobalBlocks } = useGlobalBlocks();
const blocksWithGlobals = await ensureAllGlobalBlocks(data.value);

if (blocksWithGlobals.length !== data.value.length) {
  data.value.splice(0, data.value.length, ...blocksWithGlobals);
}

watch(
  () => locale.value,
  (changedLocale: string) => {
    const url = productsCatalog.value.languageUrls[changedLocale];
    if (url) {
      router.push({
        path: buildCategoryLanguagePath(url),
        query: route.query,
      });
    }
  },
);

const headTitle = computed(() =>
  productsCatalog.value?.category
    ? categoryGetters.getMetaTitle(productsCatalog.value.category) || process.env.METATITLE || ''
    : process.env.METATITLE || '',
);

const descriptionContent = computed(() =>
  productsCatalog.value?.category
    ? categoryGetters.getMetaDescription(productsCatalog.value.category) || process.env.METADESC || ''
    : process.env.METADESC || '',
);

const keywordsContent = computed((): string =>
  productsCatalog.value?.category
    ? categoryGetters.getMetaKeywords(productsCatalog.value.category) || process.env.METAKEYWORDS || ''
    : process.env.METAKEYWORDS || '',
);

const robotsContent = computed((): string =>
  productsCatalog.value?.category ? categoryGetters.getCategoryRobots(productsCatalog.value.category) : '',
);

watch(
  () => route.query,
  async () => {
    await handleQueryUpdate();
    setCategoriesPageMeta(productsCatalog.value, getFacetsFromURL());
  },
);

watch(
  () => identifier.value,
  async (newIdentifier, oldIdentifier) => {
    if (newIdentifier !== oldIdentifier && productsCatalog.value.category?.type !== 'item') {
      actualIdentifier.value = newIdentifier;

      const { data: newData, getBlocksServer: refetchBlocks } = useCategoryTemplate(
        newIdentifier.toString(),
        'category',
        $i18n.locale.value,
      );

      await refetchBlocks(newIdentifier, 'category');

      const { ensureAllGlobalBlocks } = useGlobalBlocks();
      const blocksWithGlobals = await ensureAllGlobalBlocks(newData.value);
      if (blocksWithGlobals.length !== newData.value.length) {
        newData.value.splice(0, newData.value.length, ...blocksWithGlobals);
      }
    }
  },
);

watchEffect(() => {
  route.meta.identifier = productsCatalog.value.category?.type === 'content' ? productsCatalog.value.category?.id : 0;
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
