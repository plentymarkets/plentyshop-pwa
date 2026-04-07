<template>
  <aside
    class="h-[calc(100vh-150px)] bg-white z-[1] md:z-[10] lg:z-[150] mb-3 w-[54px] min-w-[54px] border-r"
    data-testid="edit-mode-side-toolbar"
  >
    <div class="relative flex flex-col px-1 py-1">
      <SfTooltip :label="pagesLabel" placement="right" :show-arrow="true" class="inline-grid font-editor">
        <button
          type="button"
          class="editor-button relative py-2 flex justify-center"
          :class="{ 'bg-editor-button text-white rounded-md': siteConfigurationDrawerView === 'PagesView' }"
          aria-label="Open pages drawer"
          data-testid="open-pages-drawer"
          @click="toggleDrawerView('PagesView')"
        >
          <NuxtImg v-if="siteConfigurationDrawerView === 'PagesView'" width="24" height="24" :src="pagesWhite" />
          <NuxtImg v-else width="24" height="24" :src="pagesBlack" />
        </button>
      </SfTooltip>
      <SfTooltip :label="localizationLabel" placement="right" :show-arrow="true" class="inline-grid font-editor">
        <button
          type="button"
          class="editor-button relative py-2 flex justify-center"
          :class="{ 'bg-editor-button text-white rounded-md': siteConfigurationDrawerView === 'LocalizationView' }"
          aria-label="Open pages drawer"
          data-testid="open-pages-drawer"
          @click="toggleDrawerView('LocalizationView')"
        >
          <SfIconLanguage width="24" height="24px" />
        </button>
      </SfTooltip>
      <SfTooltip :label="tableOfContentsLabel" placement="right" :show-arrow="true" class="inline-grid font-editor">
        <button
          type="button"
          class="editor-button relative py-2 flex justify-center"
          :class="{ 'bg-editor-button text-white rounded-md': siteConfigurationDrawerView === 'TableOfContents' }"
          aria-label="Open table of contents drawer"
          data-testid="open-table-of-contents-drawer"
          @click="toggleDrawerView('TableOfContents')"
        >
          <NuxtImg
            v-if="siteConfigurationDrawerView === 'TableOfContents'"
            width="24"
            height="24"
            :src="tableOfContentsWhite"
          />
          <NuxtImg v-else width="24" height="24" :src="tableOfContentsBlack" />
        </button>
      </SfTooltip>
      <component
        :is="trigger.component"
        v-for="trigger in triggersModules"
        :key="trigger.slug"
        :active="activeSetting === trigger.slug"
        @click="trigger.slug !== activeSetting && setActiveSetting(trigger.slug)"
      />
    </div>
  </aside>
</template>

<script setup lang="ts">
import { SfIconLanguage, SfTooltip } from '@storefront-ui/vue';
import pagesWhite from '~/assets/icons/paths/pages-white.svg';
import pagesBlack from '~/assets/icons/paths/pages-black.svg';
import tableOfContentsWhite from '~/assets/icons/paths/table-of-contents-white.svg';
import tableOfContentsBlack from '~/assets/icons/paths/table-of-contents-black.svg';

const {
  siteConfigurationDrawerView,
  activeSetting,
  openDrawerWithView,
  closeSiteConfigurationDrawer,
  setActiveSetting,
} = useSiteConfiguration();
const { drawerOpen: localizationDrawerOpen } = useEditorLocalizationKeys();

const pagesLabel = 'Page and category management: create, update, and organize your content.';
const localizationLabel = 'Localization settings: manage languages, translations, and regional preferences.';
const tableOfContentsLabel = 'Table of contents: view and navigate to all blocks on the current page.';

function toggleDrawerView(view: DrawerView) {
  if (siteConfigurationDrawerView.value === 'LocalizationView') {
    localizationDrawerOpen.value = false;
  }
  if (siteConfigurationDrawerView.value === view) {
    closeSiteConfigurationDrawer();
  } else {
    openDrawerWithView(view);
  }
}
</script>
