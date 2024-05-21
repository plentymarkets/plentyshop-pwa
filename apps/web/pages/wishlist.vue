<template>
  <div>
    <NuxtLayout name="default" :breadcrumbs="breadcrumbs">
      <div class="relative">
        <WishlistPageContent :title="t('wishlist')" />
      </div>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const localePath = useLocalePath();
const { t } = useI18n();
const breadcrumbs = computed(() => {
  return [
    { name: t('home'), link: localePath(paths.home) },
    { name: t('wishlist'), link: localePath(paths.wishlist) },
  ];
});
</script>
