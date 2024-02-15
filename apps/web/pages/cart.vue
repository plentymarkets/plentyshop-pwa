<template>
  <NuxtLayout
    name="checkout"
    :back-href="backHref"
    :back-label-desktop="$t('back')"
    :back-label-mobile="$t('back')"
    :heading="$t('myCart')"
  >
    <CartPageContent />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});

const router = useRouter();
const localePath = useLocalePath();
const backUrl = localePath(String(router.options.history.state.back));
const backHref =
  backUrl === localePath(String(router.options.history.state.current)) ? localePath(paths.home) : backUrl;
</script>
