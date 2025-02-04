<template>
  <UiToolbar v-if="isPreview" :style="`font-family: ${config.font}`" />
  <div class="w-100 relative" :class="{ 'lg:flex': drawerOpen }">
    <SiteConfigurationDrawer
      v-if="drawerOpen"
      class="sm:absolute lg:relative mr-3 bg-white"
      :style="`font-family: ${config.font}`"
    />

    <div class="w-100 bg-white" :class="{ 'lg:w-3/4': drawerOpen }">
      <Body class="font-body bg-editor-body-bg" :class="bodyClass" :style="currentFont" />
      <UiNotifications />
      <VitePwaManifest v-if="$pwa?.isPWAInstalled" />
      <NuxtLoadingIndicator color="repeating-linear-gradient(to right, #008ebd 0%,#80dfff 50%,#e0f7ff 100%)" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '#i18n';

const { $pwa } = useNuxtApp();
const bodyClass = ref('');
const { getCategoryTree } = useCategoryTree();
const { setInitialDataSSR } = useInitialSetup();
const { setVsfLocale } = useLocalization();
const route = useRoute();
const { locale } = useI18n();
const { setStaticPageMeta } = useCanonical();

const { currentFont } = useSiteConfiguration();

const isPreview = ref(false);
const config = useRuntimeConfig().public;
const showConfigurationDrawer = config.showConfigurationDrawer;

const { drawerOpen } = useSiteConfiguration();

onMounted(() => {
  const pwaCookie = useCookie('pwa');
  isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
});

await setInitialDataSSR();
setVsfLocale(locale.value);

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

onNuxtReady(async () => {
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
});

watch(
  () => locale.value,
  async (locale: Locale) => {
    setVsfLocale(locale);
    await getCategoryTree();
  },
);
</script>
