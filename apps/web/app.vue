<template>
  <Body class="font-body" :class="bodyClass" />
  <UiNotifications />
  <VitePwaManifest v-if="$pwa?.isPWAInstalled" />
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();
const bodyClass = ref('');
const { getCategoryTree } = useCategoryTree();
const { setInitialDataSSR } = useInitialSetup();
const { setVsfLocale } = useLocalization();
const route = useRoute();
const { locale } = useI18n();
const { setStaticPageMeta } = useCanonical();

await setInitialDataSSR();
setVsfLocale(locale.value);

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

onNuxtReady(async () => {
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
});

watch(
  () => locale.value,
  async (locale: string) => {
    setVsfLocale(locale);
    await getCategoryTree();
  },
);
</script>
