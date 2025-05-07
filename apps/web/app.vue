<template>
  <UiToolbar v-if="isPreview" :style="`font-family: ${config.font}`" />
  <div
    class="w-100 relative md:flex"
    :class="{
      'lg:flex-row-reverse': placement !== 'left',
      'md:max-lg:w-[calc(100%-54px)]': disableActions && drawerOpen,
      'md:max-lg:w-[calc(100%-66px)]': disableActions && !drawerOpen,
    }"
  >
    <SettingsToolbar
      v-if="isPreview && disableActions"
      :class="{
        'order-first': placement === 'left',
        'order-last': placement === 'right',
        'mr-3': !drawerOpen || placement === 'right',
      }"
    />

    <SiteConfigurationDrawer
      v-if="drawerOpen"
      class="absolute lg:relative bg-white"
      :class="{ 'mr-3': placement === 'left', 'ml-3': placement === 'right' }"
      :style="`font-family: ${config.font}`"
    />

    <div
      class="bg-white w-full relative"
      :class="{ 'lg:w-3/4': drawerOpen, 'lg:w-[calc(100%-66px)]': isPreview && !drawerOpen && disableActions }"
    >
      <Body class="font-body bg-editor-body-bg" :class="bodyClass" :style="currentFont" />
      <UiNotifications />
      <VitePwaManifest v-if="$pwa?.isPWAInstalled" />
      <NuxtLoadingIndicator color="repeating-linear-gradient(to right, #008ebd 0%,#80dfff 50%,#e0f7ff 100%)" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
  <UiPageModal />
  <UiUnlinkCategoryModal />
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();
const bodyClass = ref('');
const route = useRoute();
const { disableActions } = useEditor();
const { drawerOpen, currentFont, placement } = useSiteConfiguration();
const isPreview = ref(false);
const config = useRuntimeConfig().public;
const showConfigurationDrawer = config.showConfigurationDrawer;
const { setStaticPageMeta } = useCanonical();
const { setInitialDataSSR } = useInitialSetup();

await callOnce(async () => {
  await setInitialDataSSR();
});

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

onMounted(() => {
  const pwaCookie = useCookie('pwa');
  isPreview.value = !!pwaCookie.value || (showConfigurationDrawer as boolean);
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
});
</script>
