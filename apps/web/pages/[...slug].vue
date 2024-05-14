<template>
  <NuxtLayout
    name="default"
    :breadcrumbs="breadcrumbs"
    class="relative"
    :class="{ 'pointer-events-none opacity-50': loading }"
  >
    <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
    <CategoryPageContent
      v-if="productsCatalog"
      :title="categoryGetters.getCategoryName(productsCatalog.category)"
      :total-products="productsCatalog.pagination.totals"
      :products="productsCatalog.products"
      :items-per-page="Number(productsPerPage)"
    >
      <template #sidebar>
        <CategoryTree :category="category" />
        <CategorySorting />
        <CategoryItemsPerPage class="mt-6" :total-products="productsCatalog.pagination.totals" />
        <CategoryFilters v-if="facetGetters.hasFilters(productsCatalog.facets)" :facets="productsCatalog.facets" />
      </template>
    </CategoryPageContent>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { categoryGetters, categoryTreeGetters, facetGetters } from '@plentymarkets/shop-api';
import { SfLoaderCircular } from '@storefront-ui/vue';
const { setCategoriesPageMeta } = useCanonical();
definePageMeta({
  layout: false,
});

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();
const { getFacetsFromURL, checkFiltersInURL } = useCategoryFilter();
const { fetchProducts, data: productsCatalog, productsPerPage, loading } = useProducts();
const { data: categoryTree } = useCategoryTree();
const { buildCategoryLanguagePath } = useLocalization();

const handleQueryUpdate = async () => {
  await fetchProducts(getFacetsFromURL());
  checkFiltersInURL();
  if (!productsCatalog.value.category) {
    throw new Response(null, {
      status: 404,
      statusText: 'Not found',
    });
  }
};

await handleQueryUpdate();

const category = ref(productsCatalog.value.category);

const breadcrumbs = computed(() => {
  const breadcrumb = categoryTreeGetters.generateBreadcrumbFromCategory(
    categoryTree.value,
    categoryGetters.getId(category.value),
  );
  breadcrumb.unshift({ name: t('home'), link: '/' });

  return breadcrumb;
});

watch(
  () => locale.value,
  async (changedLocale: any) => {
    router.push({
      path: buildCategoryLanguagePath(`${productsCatalog.value.languageUrls[changedLocale]}`),
      query: route.query,
    });
  },
);

watch(
  () => route.query,
  async () => {
    await handleQueryUpdate();
  },
);

setCategoriesPageMeta(productsCatalog.value, getFacetsFromURL());
</script>
