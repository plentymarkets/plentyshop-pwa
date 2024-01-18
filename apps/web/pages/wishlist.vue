<template>
  <div>
    <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
      <div class="relative" :class="{ 'pointer-events-none opacity-50': loading }">
        <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
        <WishlistPageContent :title="t('wishlist')" :products="products" />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({
  layout: false,
});

const localePath = useLocalePath();
const { t } = useI18n();
const { fetchWishlist, data: products, loading } = useWishlist();

fetchWishlist();

const breadcrumbs = computed(() => {
  return [
    { name: t('home'), link: localePath(paths.home) },
    { name: t('wishlist'), link: localePath(paths.wishlist) },
  ];
});
</script>
