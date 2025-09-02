<template>
  <aside
    class="sticky top-[52px] h-[calc(100vh-150px)] bg-white z-[1] md:z-[10] lg:z-[150] mb-3 w-[54px] min-w-[54px] border-r"
    data-testid="edit-mode-side-toolbar"
  >
    <div class="relative flex flex-col px-1 py-1">
      <SfTooltip :label="pagesLabel" placement="right" :show-arrow="true" class="inline-grid">
        <button
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
import { SfTooltip } from '@storefront-ui/vue';
import pagesWhite from 'assets/icons/paths/pages-white.svg';
import pagesBlack from 'assets/icons/paths/pages-black.svg';

const { drawerView, activeSetting, openDrawerWithView, closeDrawer, setActiveSetting } = useSiteConfiguration();

const pagesLabel = 'Page and category management: create, update, and organize your content.';

function toggleDrawerView(view: DrawerView) {
  if (drawerView.value === view) {
    closeDrawer();
  } else {
    openDrawerWithView(view);
  }
}
</script>
