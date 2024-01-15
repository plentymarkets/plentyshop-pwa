<template>
  <div>
    <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
      <div class="relative" :class="{ 'pointer-events-none opacity-50': loading }">
        <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
        <WishlistPageContent
          v-if="products"
          :title="t('wishlist')"
          :total-products="products.length"
          :products="products"
          :items-per-page="Number(2)"
        />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({
  layout: false,
});

const { t } = useI18n();
const route = useRoute();
// const { fetchProducts, data: productsCatalog, productsPerPage, loading } = useProducts();
const { fetchWishlist, data: products, loading } = useWishlist();
const { data: categoryTree } = useCategoryTree();
const { locale } = useI18n();
const localePath = useLocalePath();

await fetchWishlist();
console.log('products:', products.value);

const breadcrumbs = computed(() => {
  return { name: t('wishlist'), link: '/wishlist' };
});

// setCategoriesPageMeta(productsCatalog.value, getFacetsFromURL());
</script>
