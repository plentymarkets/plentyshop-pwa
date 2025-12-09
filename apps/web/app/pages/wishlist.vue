<template>
  <div>
    <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
      <div class="relative">
        <WishlistPageContent :title="t('common.labels.wishlist')" />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });
const { setPageMeta } = usePageMeta();

const localePath = useLocalePath();
const icon = 'page';
setPageMeta(t('account.wishlist.heading'), icon);

const breadcrumbs = computed(() => [
  { name: t('common.labels.home'), link: localePath(paths.home) },
  { name: t('common.labels.wishlist'), link: localePath(paths.wishlist) },
]);
</script>
