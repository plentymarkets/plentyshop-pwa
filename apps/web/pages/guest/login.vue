<template>
    <NuxtLayout
        name="checkout"
        :back-href="backHref"   
        :back-label-desktop="$t('back')"
        :back-label-mobile="$t('back')"
        :heading="$t('checkout')"
    >
        <CartLogin/>
    </NuxtLayout>
</template>

<script setup lang="ts">
definePageMeta({
  pageType: 'static',
});

const { t } = useI18n();
const router = useRouter();
const localePath = useLocalePath();
const historyState = router.options.history.state;
const backUrl = localePath(String(historyState.back));
const currentUrl = localePath(String(historyState.current));
const homeUrl = localePath(paths.home);
const backHref = backUrl === currentUrl ? homeUrl : backUrl;
</script>