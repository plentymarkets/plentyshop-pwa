<template>
  <ClientOnly>
    <component :is="SafeModeBanner" v-if="clientPreview && isSafeMode" />
    <component :is="Toolbar" v-if="clientPreview" />
  </ClientOnly>
  <div class="w-100 relative md:flex" :class="clientPreview ? 'h-[calc(100vh-52px)]' : ''">
    <ClientOnly>
      <component :is="SettingsToolbar" v-if="clientPreview && disableActions" class="flex-shrink-0" />
    </ClientOnly>

    <component
      :is="SiteConfigurationDrawer"
      v-if="clientPreview && siteConfigurationDrawerOpen"
      class="flex-shrink-0 bg-white font-editor border-r border-gray-300 overflow-visible"
    />

    <!-- Editor-Modus (Parent): Device-Switch + Iframe-Preview -->
    <div v-if="clientPreview" class="flex-1 w-full bg-gray-100 relative flex flex-col">
      <!-- Temporärer Device-Switch (später in Toolbar verschieben) -->
      <div class="flex gap-2 p-2 border-b bg-white">
        <button
          v-for="d in (['mobile', 'tablet', 'desktop'] as const)"
          :key="d"
          class="px-3 py-1 rounded text-sm"
          :class="device === d ? 'bg-blue-500 text-white' : 'bg-gray-200'"
          @click="setDevice(d)"
        >
          {{ d }}
        </button>
      </div>

      <div class="flex-1 overflow-auto flex items-start justify-center p-4">
        <iframe
          :src="previewUrl"
          :style="{ width: previewWidth, height: '100%' }"
          class="bg-white shadow-lg transition-all duration-300 border-0 max-w-full"
        />
      </div>
    </div>

    <!-- Storefront- ODER Iframe-Render-Modus: nur App-Content, kein Editor-Chrome -->
    <div v-else ref="contentRef" class="flex-1 w-full bg-white relative overflow-visible">
      <Body class="font-body bg-editor-body-bg" :class="bodyClass" :style="currentFont" />
      <UiNotifications />
      <VitePwaManifest />
      <NuxtLoadingIndicator color="repeating-linear-gradient(to right, #008ebd 0%,#80dfff 50%,#e0f7ff 100%)" />
      <NuxtLayout :key="previewRenderKey">
        <NuxtPage />
      </NuxtLayout>
    </div>

    <component
      :is="BlocksConfigurationDrawer"
      v-if="clientPreview && blocksConfigurationDrawerOpen"
      class="flex-shrink-0 bg-white font-editor border-l border-gray-300 overflow-y-auto"
    />
  </div>
  <ClientOnly>
    <component :is="PageModal" v-if="clientPreview" />
    <component :is="UnlinkCategoryModal" v-if="clientPreview" />
    <component :is="ResetProductPageModal" v-if="clientPreview" />
    <component :is="AddBlockPopoverComponent" v-if="enablePopover && clientPreview" />
  </ClientOnly>
</template>

<script setup lang="ts">
import { isCssUrl, isJsUrl } from '~/utils/assets';
import { categoryGetters } from '@plentymarkets/shop-api';

const bodyClass = ref('');
const route = useRoute();
const viewport = useViewport();
const { disableActions } = useEditor();
const { siteConfigurationDrawerOpen, blocksConfigurationDrawerOpen, currentFont } = useSiteConfiguration();
const { setStaticPageMeta } = useUrlPageMeta();
const { isInEditorClient } = useEditorState();
const { device, setDevice, width: previewWidth } = useEditorPreview();

// Sync-Tick: im Iframe ist das eine Reactive-Ref, die bei jeder Parent-State-Mutation
// hochzählt. Außerhalb des Iframes (Parent / Storefront) ist es einfach ein ref(0)
// ohne Effekt.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const editorPreviewTick =
  (typeof window !== 'undefined' && (window as any).__editorPreviewSyncTick) || ref(0);

// Debounced Re-Render Key: zählt erst nach 150ms Tipp-Pause hoch.
// Verhindert, dass NuxtLayout bei jedem Keystroke neu mountet.
const previewRenderKey = ref(0);

if (import.meta.client) {
  let previewRenderTimer: ReturnType<typeof setTimeout> | null = null;
  watch(editorPreviewTick, () => {
    if (previewRenderTimer) clearTimeout(previewRenderTimer);
    previewRenderTimer = setTimeout(() => {
      previewRenderKey.value++;
      previewRenderTimer = null;
    }, 150);
  });
}

const enablePopover = useRuntimeConfig().public.enableAddBlockPopover;

// Iframe-Render: wir sind im Iframe und sollen NUR den Storefront-Content zeigen, kein Editor-Chrome
const isPreviewIframe = computed(() => {
  if (import.meta.server) return false;
  return window.parent !== window && new URLSearchParams(window.location.search).has('__preview');
});

// clientPreview: zeigt Editor-Chrome — niemals im Iframe selbst
const clientPreview = computed(
  () => isInEditorClient.value && viewport.isGreaterOrEquals('lg') && !isPreviewIframe.value,
);

const contentRef = ref<HTMLElement | null>(null);

// Iframe-URL — bleibt stabil, ändert sich nicht bei Device-Wechsel (sonst Full-Reload)
const previewUrl = computed(() => {
  const sep = route.fullPath.includes('?') ? '&' : '?';
  return `${route.fullPath}${sep}__preview=1`;
});

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

const title = ref(getCategoryMetaTitle());
const ogTitle = ref(getCategoryOgTitle());
const ogImage = ref(getOgImage());
const ogDescription = ref(getCategoryMetaDescription());
const description = ref(getCategoryMetaDescription());
const keywords = ref(getCategoryMetaKeywords());
const robots = ref(getRobots());
const fav = ref(getFavicon());
const themeColor = ref(getPrimaryColor());

const cssAssets = computed(() => (isSafeMode.value ? [] : getAssetsOfType('css')));

const jsHeadAssets = computed(() =>
  isSafeMode.value
    ? []
    : getAssetsOfType('javascript').filter(
        (asset) => asset.isActive && (asset.placement === 'head_end' || !asset.placement),
      ),
);

const jsFooterAssets = computed(() =>
  isSafeMode.value
    ? []
    : getAssetsOfType('javascript').filter((asset) => asset.isActive && asset.placement === 'body_end'),
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
  ogDescription.value = getCategoryMetaDescription();
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
      ...jsHeadAssets.value.map((asset) => ({
        key: `custom-js-${asset.uuid}`,
        innerHTML: asset.content,
      })),
      ...jsFooterAssets.value.map((asset) => ({
        key: `custom-js-${asset.uuid}-footer`,
        innerHTML: asset.content,
        tagPosition: 'bodyClose',
      })),
      ...jsExternalAssets.value.map((asset) => ({
        key: `external-js-${asset.uuid}`,
        src: asset.content,
        defer: true,
      })),
    ],
  });

  watch(
    () => route.path,
    () => {
      if (clientPreview.value) contentRef.value?.scrollTo({ top: 0 });
    },
  );
}

if (route?.meta.pageType === 'static') setStaticPageMeta();
usePageTitle();

onMounted(() => {
  bodyClass.value = 'hydrated'; // Need this class for cypress testing
});

const SafeModeBanner = defineAsyncComponent(() => import('~/components/SafeModeBanner/SafeModeBanner.vue'));
const Toolbar = defineAsyncComponent(() => import('~/components/ui/Toolbar/Toolbar.vue'));
const SettingsToolbar = defineAsyncComponent(() => import('~/components/SettingsToolbar/SettingsToolbar.vue'));
const SiteConfigurationDrawer = defineAsyncComponent(
  () => import('~/components/SiteConfigurationDrawer/SiteConfigurationDrawer.vue'),
);
const BlocksConfigurationDrawer = defineAsyncComponent(
  () => import('~/components/SiteConfigurationDrawer/BlocksConfigurationDrawer.vue'),
);
const PageModal = defineAsyncComponent(() => import('~/components/ui/PageModal/PageModal.vue'));
const UnlinkCategoryModal = defineAsyncComponent(
  () => import('~/components/ui/UnlinkCategoryModal/UnlinkCategoryModal.vue'),
);
const ResetProductPageModal = defineAsyncComponent(
  () => import('~/components/ui/ResetProductPageModal/ResetProductPageModal.vue'),
);
const AddBlockPopoverComponent = defineAsyncComponent(() => import('~/components/AddBlockPopover/AddBlockPopover.vue'));
</script>

<style lang="scss">
@use '~/assets/style.scss';
</style>