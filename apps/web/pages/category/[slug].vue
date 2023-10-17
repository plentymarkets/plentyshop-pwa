<template>
  <NuxtLayout name="default" :breadcrumbs="breadcrumbs" class="pointer-events-none opacity-50">
    <Breadcrumbs />
    <div class="relative" :class="{ 'pointer-events-none opacity-50': loading }">
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
          <CategoryFilters :facets="productsCatalog.facets" />
        </template>
      </CategoryPageContent>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { categoryGetters, categoryTreeGetters } from '@plentymarkets/shop-sdk';
import { SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({
  layout: false,
});

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const { getFacetsFromURL } = useCategoryFilter();
const { fetchProducts, data: productsCatalog, productsPerPage, loading } = useProducts();
const { data: categoryTree } = useCategoryTree();
const { locale } = useI18n();
const localePath = useLocalePath();

const setCategoryCanonical = () => {
  const runtimeConfig = useRuntimeConfig();
  if (productsCatalog.value.languageUrls) {
    let xdefault = productsCatalog.value.languageUrls['x-default'];
    xdefault = xdefault[xdefault.length - 1] === '/' ? xdefault.slice(0, Math.max(0, xdefault.length - 1)) : xdefault;
    useHead({
      link: [
        {
          rel: 'canonical',
          href: getFacetsFromURL().facets
            ? `${runtimeConfig.public.apiUrl}/c${xdefault}?=${getFacetsFromURL().facets}`
            : `${runtimeConfig.public.apiUrl}/c${xdefault}`,
        },
      ],
    });
    Object.keys(productsCatalog.value.languageUrls).forEach((key) => {
      let link = productsCatalog.value.languageUrls[key];
      link = link[link.length - 1] === '/' ? link.slice(0, Math.max(0, link.length - 1)) : link;
      useHead({
        link: [
          {
            rel: 'alternate',
            hreflang: key,
            href: `${runtimeConfig.public.apiUrl}/c${link}`,
          },
        ],
      });
    });
  }
};
const handleQueryUpdate = async () => {
  await fetchProducts(getFacetsFromURL());
  setCategoryCanonical();
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
      path: localePath(`/c${productsCatalog.value.languageUrls[changedLocale]}`),
      query: route.query,
    });
  },
);

watch(
  () => route.query,
  async () => {
    handleQueryUpdate();
  },
);
</script>
