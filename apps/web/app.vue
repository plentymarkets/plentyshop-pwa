<template>
  <ClientOnly>
    <component :is="Toolbar" v-if="clientPreview" />
  </ClientOnly>
  <div
    class="w-100 relative md:flex"
    :class="{
      'lg:flex-row-reverse': placement !== 'left',
      'md:max-lg:w-[calc(100%-54px)]': disableActions && drawerOpen && clientPreview,
      'md:max-lg:w-[calc(100%-66px)]': disableActions && !drawerOpen && clientPreview,
    }"
  >
    <ClientOnly>
      <component
        :is="SettingsToolbar"
        v-if="clientPreview && disableActions"
        :class="{
          'order-first': placement === 'left',
          'order-last': placement === 'right',
          'mr-3': !drawerOpen || placement === 'right',
        }"
      />
    </ClientOnly>

    <component
      :is="SiteConfigurationDrawer"
      v-if="drawerOpen"
      class="absolute lg:relative bg-white font-editor"
      :class="{ 'mr-3': placement === 'left', 'ml-3': placement === 'right' }"
    />

    <div
      class="bg-white w-full relative"
      :class="{
        'lg:w-3/4': drawerOpen,
        'transition-all duration-300 ease-in-out': placement === 'left' && drawerOpen,
        'lg:w-[calc(100%-66px)]': clientPreview && !drawerOpen && disableActions,
      }"
    >
      <Body class="font-body bg-editor-body-bg" :class="bodyClass" :style="currentFont" />
      <UiNotifications />
      <VitePwaManifest />
      <NuxtLoadingIndicator color="repeating-linear-gradient(to right, #008ebd 0%,#80dfff 50%,#e0f7ff 100%)" />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
  <ClientOnly>
    <component :is="PageModal" v-if="clientPreview" />
    <component :is="UnlinkCategoryModal" v-if="clientPreview" />
  </ClientOnly>
  <ClientOnly>
    <LazyReloadPWA hydrate-on-idle />
  </ClientOnly>
</template>

<script setup lang="ts">
const { $isPreview } = useNuxtApp();
const bodyClass = ref('');
const route = useRoute();
const { disableActions } = useEditor();
const { drawerOpen, currentFont, placement } = useSiteConfiguration();
const { setStaticPageMeta } = useCanonical();
const { setInitialDataSSR } = useInitialSetup();

const clientPreview = ref(false);

onNuxtReady(() => (clientPreview.value = !!$isPreview));

const { getSetting: getFavicon } = useSiteSettings('favicon');
const { getSetting: getOgTitle } = useSiteSettings('ogTitle');
const { getSetting: getOgImage } = useSiteSettings('ogImage');
const { getSetting: getMetaTitle } = useSiteSettings('metaTitle');
const { getSetting: getMetaDescription } = useSiteSettings('metaDescription');
const { getSetting: getMetaKeywords } = useSiteSettings('metaKeywords');
const { getSetting: getRobots } = useSiteSettings('robots');
const { getSetting: getPrimaryColor } = useSiteSettings('primaryColor');

const title = ref(getMetaTitle());
const ogTitle = ref(getOgTitle());
const ogImage = ref(getOgImage());
const description = ref(getMetaDescription());
const keywords = ref(getMetaKeywords());
const robots = ref(getRobots());
const fav = ref(getFavicon());
const themeColor = ref(getPrimaryColor());

watchEffect(() => {
  title.value = getMetaTitle();
  ogTitle.value = getOgTitle();
  ogImage.value = getOgImage();
  description.value = getMetaDescription();
  keywords.value = getMetaKeywords();
  robots.value = getRobots();
  fav.value = getFavicon();
  themeColor.value = getPrimaryColor();
});

useSeoMeta({
  title: () => title.value,
  ogTitle: () => ogTitle.value,
  ogImage: () => ogImage.value,
  description: () => description.value,
  keywords: () => keywords.value,
  robots: () => robots.value,
  themeColor: () => themeColor.value,
  generator: 'plentymarkets',
});

useHead({
  link: () => [
    { rel: 'icon', href: fav.value },
    { rel: 'apple-touch-icon', href: fav.value },
  ],
});

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
