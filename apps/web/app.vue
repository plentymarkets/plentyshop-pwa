<template>
  <Body class="font-body" :class="bodyClass" />
  <UiNotifications />
  <VitePwaManifest v-if="$pwa?.isPWAInstalled" />
  <NuxtLoadingIndicator :color="loadingIndicatorColor" :height="5" />
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
const runtimeConfig = useRuntimeConfig();
const primaryColor = ref(runtimeConfig.public.primaryColor);
const secondaryColor = ref(runtimeConfig.public.secondaryColor);

await setInitialDataSSR();
setVsfLocale(locale.value);

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

onNuxtReady(async () => {
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
});

const loadingIndicatorColor = computed(() => {
  return `repeating-linear-gradient(to right, ${primaryColor.value} 0%, ${secondaryColor.value} 50%, ${secondaryColor.value} 100%)`;
});

watch(
  () => locale.value,
  async (locale: string) => {
    setVsfLocale(locale);
    await getCategoryTree();
  },
);
</script>
