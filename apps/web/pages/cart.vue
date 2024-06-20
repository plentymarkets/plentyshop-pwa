<template>
  <NuxtLayout
    name="checkout"
    :back-to-cart="false"
    :back-label-desktop="$t('back')"
    :back-label-mobile="$t('back')"
    :heading="$t('myCart')"
  >
    <CartPageContent />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ pageType: 'static' });
</script>
