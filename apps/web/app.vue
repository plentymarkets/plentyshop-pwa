<template>
  <component :is="Toolbar" v-if="isPreview" :style="`font-family: ${config.font}`" />
  <div
    class="w-100 relative md:flex"
    :class="{
      'lg:flex-row-reverse': placement !== 'left',
      'md:max-lg:w-[calc(100%-54px)]': disableActions && drawerOpen && isPreview,
      'md:max-lg:w-[calc(100%-66px)]': disableActions && !drawerOpen && isPreview,
    }"
  >
    <component
      :is="SettingsToolbar"
      v-if="isPreview && disableActions"
      :class="{
        'order-first': placement === 'left',
        'order-last': placement === 'right',
        'mr-3': !drawerOpen || placement === 'right',
      }"
    />

    <component
      :is="SiteConfigurationDrawer"
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
  <component :is="PageModal" v-if="isPreview" />
  <component :is="UnlinkCategoryModal" v-if="isPreview" />
</template>

<script setup lang="ts">
const { $pwa } = useNuxtApp();
const bodyClass = ref('');
const route = useRoute();
const { disableActions } = useEditor();
const { drawerOpen, currentFont, placement } = useSiteConfiguration();
const config = useRuntimeConfig().public;
const isPreview = config.isPreview;
const { setStaticPageMeta } = useCanonical();
const { setInitialDataSSR } = useInitialSetup();

await callOnce(async () => {
  await setInitialDataSSR();
});

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

onMounted(() => {
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
});

const Toolbar = defineAsyncComponent(() => import('~/components/ui/Toolbar/Toolbar.vue'));
const SettingsToolbar = defineAsyncComponent(() => import('~/components/SettingsToolbar/SettingsToolbar.vue'));
const SiteConfigurationDrawer = defineAsyncComponent(
  () => import('~/components/SiteConfigurationDrawer/SiteConfigurationDrawer.vue'),
);
const PageModal = defineAsyncComponent(() => import('~/components/ui/PageModal/PageModal.vue'));
const UnlinkCategoryModal = defineAsyncComponent(
  () => import('~/components/ui/UnlinkCategoryModal/UnlinkCategoryModal.vue'),
);
</script>
