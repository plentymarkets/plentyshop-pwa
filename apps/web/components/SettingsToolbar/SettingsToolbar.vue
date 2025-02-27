<template>
  <aside class="sticky top-0 bg-white z-[1] md:z-[10] lg:z-[160] mb-3 h-screen w-[54px] min-w-[54px]" data-testid="edit-mode-toolbar">
    <div class="relative flex flex-col px-1 py-1">
      <button
        type="button"
        class="editor-button relative py-2"
        :class="{'bg-editor-button text-white rounded-md': drawerView === 'PagesView'}"
        aria-label="Open pages drawer"
        data-testid="open-pages-drawer"
        @click="openDrawerWithView( 'PagesView')"
      >
        <SfIconSort />
      </button>
      <button
        type="button"
        class="editor-button relative py-2 flex justify-center"
        :class="{'bg-editor-button text-white rounded-md': drawerView === 'DesignView'}"
        aria-label="Open design drawer"
        data-testid="open-design-drawer"
        @click="openDrawerWithView('DesignView')"
      >
        <NuxtImg v-if="drawerView === 'DesignView'" width="24" height="24px" src="/images/paint-brush-white.svg" />
        <NuxtImg v-else width="24" height="24px" src="/images/paint-brush-black.svg" />
      </button>
      <button
        type="button"
        class="editor-button relative py-2 flex justify-center"
        :class="{'bg-editor-button text-white rounded-md': drawerView === 'SettingsView'}"
        aria-label="Open settings drawer"
        data-testid="open-settings-drawer"
        @click="openDrawerWithView('SettingsView')"
      >
        <NuxtImg v-if="drawerView === 'SettingsView'" width="24" height="24px" src="/images/gear-white.svg" />
        <NuxtImg v-else width="24" height="24px" src="/images/gear-black.svg" />
      </button>
      <button
        type="button"
        class="editor-button relative py-2"
        :class="{'bg-editor-button text-white rounded-md': drawerView === 'SeoView'}"
        aria-label="Open seo drawer"
        data-testid="open-seo-drawer"
        @click="openDrawerWithView( 'SeoView')"
      >
        <SfIconSearch />
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import {SfIconSort, SfIconSearch} from '@storefront-ui/vue';

const { drawerView, openDrawerWithView } = useSiteConfiguration();
</script>