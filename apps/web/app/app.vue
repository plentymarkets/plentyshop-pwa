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
        'w-[calc(50vw-80px)] lg:w-[calc(75vw-80px)] xl:w-[calc(80vw-80px)]': drawerOpen,
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
    <component :is="ResetProductPageModal" v-if="clientPreview" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { isCssUrl, isJsUrl } from '~/utils/assets';
import { categoryGetters } from '@plentymarkets/shop-api';

const { $isPreview } = useNuxtApp();
const bodyClass = ref('');
const route = useRoute();
const { disableActions } = useEditor();
const { drawerOpen, currentFont, placement } = useSiteConfiguration();
const { setStaticPageMeta } = useCanonical();

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
const { getSetting: customAssetsSafeMode } = useSiteSettings('customAssetsSafeMode');

const { data: productsCatalog } = useProducts();

const category = computed(() => productsCatalog.value?.category);
const isCategoryPage = computed(() => route.meta?.type === 'category' && !!category.value);

const { getAssetsOfType } = useCustomAssets();

const isSafeMode = computed(() => customAssetsSafeMode());

const getCategoryMetaTitle = () => {
  if (isCategoryPage.value) {
    const categoryMetaTitle = categoryGetters.getMetaTitle(category.value);
    if (categoryMetaTitle) return categoryMetaTitle;
  }
  return getMetaTitle();
};

const getCategoryMetaDescription = () => {
  if (isCategoryPage.value) {
    const categoryMetaDescription = categoryGetters.getMetaDescription(category.value);
    if (categoryMetaDescription) return categoryMetaDescription;
  }
  return getMetaDescription();
};

const getCategoryMetaKeywords = () => {
  if (isCategoryPage.value) {
    const categoryMetaKeywords = categoryGetters.getMetaKeywords(category.value);
    if (categoryMetaKeywords) return categoryMetaKeywords;
  }
  return getMetaKeywords();
};

const getCategoryOgTitle = () => {
  if (isCategoryPage.value) {
    const categoryMetaTitle = categoryGetters.getMetaTitle(category.value);
    if (categoryMetaTitle) return categoryMetaTitle;
  }
  return getOgTitle() || getMetaTitle();
};

const getCategoryOgDescription = () => {
  if (isCategoryPage.value) {
    const categoryMetaDescription = categoryGetters.getMetaDescription(category.value);
    if (categoryMetaDescription) return categoryMetaDescription;
  }
  return getMetaDescription();
};

const title = ref(getCategoryMetaTitle());
const ogTitle = ref(getCategoryOgTitle());
const ogImage = ref(getOgImage());
const ogDescription = ref(getCategoryOgDescription());
const description = ref(getCategoryMetaDescription());
const keywords = ref(getCategoryMetaKeywords());
const robots = ref(getRobots());
const fav = ref(getFavicon());
const themeColor = ref(getPrimaryColor());

const cssAssets = computed(() => (isSafeMode.value ? [] : getAssetsOfType('css')));

const jsAssets = computed(() =>
  isSafeMode.value ? [] : getAssetsOfType('javascript').filter((asset) => asset.isActive),
);

const metaAssets = computed(() => (isSafeMode.value ? [] : getAssetsOfType('meta').filter((asset) => asset.isActive)));
const cssExternalAssets = computed(() =>
  isSafeMode.value ? [] : getAssetsOfType('external').filter((asset) => isCssUrl(asset.content)),
);
const jsExternalAssets = computed(() =>
  isSafeMode.value ? [] : getAssetsOfType('external').filter((asset) => asset.isActive && isJsUrl(asset.content)),
);

watchEffect(() => {
  title.value = getCategoryMetaTitle();
  ogTitle.value = getCategoryOgTitle();
  ogImage.value = getOgImage();
  ogDescription.value = getCategoryOgDescription();
  description.value = getCategoryMetaDescription();
  keywords.value = getCategoryMetaKeywords();
  robots.value = getRobots();
  fav.value = getFavicon();
  themeColor.value = getPrimaryColor();
});

useSeoMeta({
  title: () => title.value,
  ogTitle: () => ogTitle.value,
  ogImage: () => ogImage.value,
  ogDescription: () => ogDescription.value,
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
    ...cssExternalAssets.value.map((asset, index) => ({
      key: `external-css-${asset.uuid ?? index}`,
      rel: 'stylesheet',
      media: asset.isActive ? 'all' : 'not all',
      href: asset.content,
    })),
  ],
  meta: () =>
    metaAssets.value
      .filter((asset) => asset.name && asset.content)
      .map((asset) => ({
        key: `custom-meta-${asset.uuid}`,
        name: asset.name,
        content: asset.content,
      })),
  style: () =>
    cssAssets.value.map((asset) => ({
      key: `custom-css-${asset.uuid}-o${asset.order ?? 0}`,
      textContent: asset.content,
      media: asset.isActive ? 'all' : 'not all',
      tagPriority: 100 + (asset.order ?? 0),
    })),
});

if (import.meta.client) {
  useHead({
    script: () => [
      ...jsAssets.value.map((asset) => ({
        key: `custom-js-${asset.uuid}`,
        innerHTML: asset.content,
      })),
      ...jsExternalAssets.value.map((asset) => ({
        key: `external-js-${asset.uuid}`,
        src: asset.content,
        defer: true,
      })),
    ],
  });
}

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
const ResetProductPageModal = defineAsyncComponent(
  () => import('~/components/ui/ResetProductPageModal/ResetProductPageModal.vue'),
);
</script>

<style lang="scss">
@use '~/assets/style.scss';
</style>
