<template>
  <NuxtLayout
    name="checkout"
    :back-href="backHref"
    :back-label-desktop="$t('back')"
    :back-label-mobile="$t('back')"
    :heading="$t('checkout')"
  >
    <GuestLogin />
  </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});

const router = useRouter();
const localePath = useLocalePath();
const historyState = router.options.history.state;
const backUrl = localePath(historyState?.back?.toString() ?? '');
const currentUrl = localePath(historyState?.current?.toString() ?? '');
const homeUrl = localePath(paths.home);
const backHref = backUrl === currentUrl ? homeUrl : backUrl;
</script>
