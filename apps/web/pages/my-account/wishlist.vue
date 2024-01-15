<template>
  <ClientOnly>
    <div class="relative col-span-4" :class="{ 'pointer-events-none opacity-50': loading }">
      <SfLoaderCircular v-if="loading" class="fixed top-[50%] right-0 left-0 m-auto z-[99999]" size="2xl" />
      <WishlistPageContent v-if="products" :with-header="false" :products="products" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { SfLoaderCircular } from '@storefront-ui/vue';

definePageMeta({
  layout: 'account',
  pageType: 'static',
});

const { fetchWishlist, data: products, loading } = useWishlist();

fetchWishlist();
</script>
