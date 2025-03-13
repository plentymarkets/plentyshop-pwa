<template>
  <div class="pages-view sticky top-[52px]" data-testid="site-settings-drawer">
    <header class="flex items-center justify-between px-4 py-5 border-b mb-4">
      <div class="flex items-center text-xl font-bold">Pages</div>
      <button data-testid="pages-view-close" class="!p-0" @click="closeDrawer">
        <SfIconClose />
      </button>
    </header>

    <div class="mx-4">
      <button
        type="button"
        data-testid="add-page-btn"
        class="border border-editor-button w-full py-1 rounded-md flex align-center justify-center text-editor-button"
        @click="togglePageModal(true)"
      >
        <SfIconAdd /> Add Page
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconAdd } from '@storefront-ui/vue';

const { closeDrawer, togglePageModal } = useSiteConfiguration();
</script>
