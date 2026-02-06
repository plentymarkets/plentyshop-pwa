<template>
  <NuxtLayout
    name="default"
    :breadcrumbs="breadcrumbs"
    class="relative"
    :class="{ 'pointer-events-none opacity-50': loading }"
  >
    <template #header>
      <EditableHeader :header="header" />
    </template>
    <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
    <EditableMain :main="main" data-testid="category-page-content" />
    <EditableFooter :footer="footer" />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { categoryGetters, categoryTreeGetters } from '@plentymarkets/shop-api';
import type { Block } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
import type { Locale } from '#i18n';
import categoryTemplateData from '~/composables/useCategoryTemplate/categoryTemplateData.json';

defineI18nRoute({
  locales: process.env.LANGUAGELIST?.split(',') as Locale[],
});

const { locale } = useI18n();
const { $i18n } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const { setCategoriesPageMeta } = useCanonical();
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

let pageBlocksComposable: ReturnType<typeof usePageBlocks> | null = null;

const header = computed(() => (pageBlocksComposable?.header?.value as Block[] | undefined) ?? []);
const main = computed(() => (pageBlocksComposable?.main?.value as Block[] | undefined) ?? []);
const footer = computed(() => (pageBlocksComposable?.footer?.value as Block[] | undefined) ?? []);

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
  setBlocksListContext(productsCatalog.value.category.type === 'item' ? 'productCategory' : 'content');
});

pageBlocksComposable = usePageBlocks(identifier.value.toString(), 'category', $i18n.locale.value);
pageBlocksComposable.setDefaultTemplate(categoryTemplateData as Block[]);

await pageBlocksComposable.fetchPageBlocks(identifier.value.toString(), 'category');

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
  route.meta.identifier = productsCatalog.value.category?.type === 'content' ? productsCatalog.value.category?.id : 0;
});

// Watch identifier changes to refetch blocks when navigating between categories
watch(
  () => identifier.value,
  async (newIdentifier) => {
    pageBlocksComposable = usePageBlocks(newIdentifier.toString(), 'category', $i18n.locale.value);
    pageBlocksComposable.setDefaultTemplate(categoryTemplateData as Block[]);
    await pageBlocksComposable.fetchPageBlocks(newIdentifier.toString(), 'category');
  },
);

useHead({
  title: headTitle,
  meta: [
    { name: 'description', content: descriptionContent },
    { name: 'keywords', content: keywordsContent },
    { name: 'robots', content: robotsContent },
  ],
});
</script>
