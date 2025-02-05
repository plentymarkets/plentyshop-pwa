<template>
  <div class="site-settings-view sticky top-[52px]">
    <header class="flex items-center justify-between px-4 py-5 border-b">
      <div class="flex items-center text-xl font-bold">Settings</div>
      <UiButton square variant="tertiary" size="sm" class="!p-0" @click="drawerOpen = false">
        <SfIconClose />
      </UiButton>
    </header>

    <UiImageTextForm />

  </div>
</template>
<script setup lang="ts">
import { SfIconClose } from '@storefront-ui/vue';
const { drawerOpen } = useSiteConfiguration();
</script>
