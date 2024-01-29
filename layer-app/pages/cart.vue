<template>
  <NuxtLayout
    name="checkout"
    :back-href="localePath(paths.category)"
    :back-label-desktop="$t('backToShopping')"
    :back-label-mobile="$t('back')"
    :heading="$t('myCart')"
  >
    <CartPageContent />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  layoutName: 'checkout',
  pageType: 'static',
});

const localePath = useLocalePath();
</script>
