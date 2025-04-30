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
      <button
        type="button"
        class="editor-button relative py-2 flex justify-center"
        :class="{ 'bg-editor-button text-white rounded-md': drawerView === 'DesignView' }"
        aria-label="Open design drawer"
        data-testid="open-design-drawer"
        @click="toggleDrawerView('DesignView')"
      >
        <NuxtImg v-if="drawerView === 'DesignView'" width="24" height="24px" :src="paintBrushWhite" />
        <NuxtImg v-else width="24" height="24px" :src="paintBrushBlack" />
      </button>
      <button
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
      <!-- <button
             type="button"
             class="editor-button relative py-2"
             :class="{ 'bg-editor-button text-white rounded-md': drawerView === 'SeoView' }"
             aria-label="Open seo drawer"
             data-testid="open-seo-drawer"
             @click="openDrawerWithView('SeoView')"
           >
             <SfIconSearch />
           </button> -->
    </div>
  </aside>
</template>

<script setup lang="ts">
import gearBlack from 'assets/icons/paths/gear-black.svg';
import gearWhite from 'assets/icons/paths/gear-white.svg';

import paintBrushBlack from 'assets/icons/paths/paint-brush-black.svg';
import paintBrushWhite from 'assets/icons/paths/paint-brush-white.svg';
import pagesWhite from 'assets/icons/paths/pages-white.svg';
import pagesBlack from 'assets/icons/paths/pages-black.svg';
const { drawerView, openDrawerWithView, closeDrawer } = useSiteConfiguration();
const runtimeConfig = useRuntimeConfig();

function toggleDrawerView(view: DrawerView) {
  if (drawerView.value === view) {
    closeDrawer();
  } else {
    openDrawerWithView(view);
  }
}
</script>
