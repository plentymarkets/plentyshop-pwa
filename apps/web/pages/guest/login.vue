<template>
  <NuxtLayout
    name="checkout"
    :back-label-desktop="$t('back')"
    :back-label-mobile="$t('back')"
    :heading="$t('checkout')"
  >
    <GuestLogin />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({ pageType: 'static' });
</script>
