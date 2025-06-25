<template>
  <aside
    class="sticky top-[52px] h-[calc(100vh-150px)] bg-white z-[1] md:z-[10] lg:z-[150] mb-3 w-[54px] min-w-[54px] border-r"
    data-testid="edit-mode-side-toolbar"
  >
    <div class="relative flex flex-col px-1 py-1">
      <button
        v-if="runtimeConfig.public.isDev"
        type="button"
        class="editor-button relative py-2 flex justify-center"
        :class="{ 'bg-editor-button text-white rounded-md': drawerView === 'PagesView' }"
        aria-label="Open pages drawer"
        data-testid="open-pages-drawer"
        @click="toggleDrawerView('PagesView')"
      >
        <NuxtImg v-if="drawerView === 'PagesView'" width="24" height="24" :src="pagesWhite" />
        <NuxtImg v-else width="24" height="24" :src="pagesBlack" />
      </button>

      <component
        :is="trigger.component"
        v-for="trigger in triggers"
        :key="trigger.slug"
        :active="activeSetting === trigger.slug"
        @click="setActiveSetting(trigger.slug)"
      />

      <button
        v-if="runtimeConfig.public.isDev"
        type="button"
        class="editor-button relative py-2 flex justify-center"
        :class="{ 'bg-editor-button text-white rounded-md': drawerView === 'SettingsView' }"
        aria-label="Open settings drawer"
        data-testid="open-settings-drawer"
        @click="toggleDrawerView('SettingsView')"
      >
        <NuxtImg v-if="drawerView === 'SettingsView'" width="24" height="24px" :src="gearWhite" />
        <NuxtImg v-else width="24" height="24px" :src="gearBlack" />
      </button>
      <button
        v-if="runtimeConfig.public.isDev"
        type="button"
        class="editor-button relative py-2 flex justify-center"
        :class="{ 'bg-editor-button text-white rounded-md': drawerView === 'SeoView' }"
        aria-label="Open SEO settings drawer"
        data-testid="open-seo-drawer"
        @click="toggleDrawerView('SeoView')"
      >
        <SfIconSearch v-if="drawerView === 'SeoView'" class="text-white" />
        <SfIconSearch v-else />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import gearBlack from 'assets/icons/paths/gear-black.svg';
import gearWhite from 'assets/icons/paths/gear-white.svg';

import { SfIconSearch } from '@storefront-ui/vue';
import pagesWhite from 'assets/icons/paths/pages-white.svg';
import pagesBlack from 'assets/icons/paths/pages-black.svg';

const {
  drawerView,
  activeSetting,
  openDrawerWithView,
  closeDrawer,
  updatePrimaryColor,
  updateSecondaryColor,
  updateHeaderBackgroundColor,
  loadGoogleFont,
  setActiveSetting,
} = useSiteConfiguration();
const runtimeConfig = useRuntimeConfig();
const { getSetting: getPrimaryColorSetting } = useSiteSettings('primaryColor');
const { getSetting: getSecondaryColorSetting } = useSiteSettings('secondaryColor');
const { getSetting: getHeaderBackgroundSetting } = useSiteSettings('headerBackgroundColor');
const { getSetting: getFontSetting } = useSiteSettings('font');

function toggleDrawerView(view: DrawerView) {
  if (drawerView.value === view) {
    closeDrawer();
  } else {
    openDrawerWithView(view);
  }
}

const triggerModules = import.meta.glob('@/components/**/settings/*/*ToolbarTrigger.vue') as Record<
  string,
  () => Promise<{ default: unknown }>
>;

const stripPrefix = (raw: string) => raw.replace(/^(\\d+)\\./, '');

const triggers = computed(() => {
  return Object.entries(triggerModules).map(([path, loader]) => {
    const match = path.match(/settings\/([^/]+)\//);
    const settingFolder = match ? match[1] : '';

    console.log('settingFolder: ', settingFolder);
    return {
      slug: stripPrefix(settingFolder),
      component: defineAsyncComponent(loader),
    };
  });
});

watch(
  () => getPrimaryColorSetting(),
  (newValue) => {
    updatePrimaryColor(newValue);
  },
);

watch(
  () => getSecondaryColorSetting(),
  (newValue) => {
    updateSecondaryColor(newValue);
  },
);

watch(
  () => getHeaderBackgroundSetting(),
  (newValue) => {
    updateHeaderBackgroundColor(newValue);
  },
);

watch(
  () => getFontSetting(),
  (newValue) => {
    loadGoogleFont(newValue);
  },
);
</script>
