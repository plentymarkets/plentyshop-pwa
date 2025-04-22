<template>
  <SfDrawer
    v-model="open"
    class="bg-white border-0 shadow-[inset_0px_0px_20px_-20px_#111] category-drawer !absolute ml-[100%] w-[430px] min-w-[300px]"
    :placement="placement"
    :disable-click-away="true"
    :class="[{ 'max-w-[370px]': placement === 'left' || placement === 'right' }]"
  >
    <div class="px-4 py-5 border-b flex justify-between items-center">
      <h3 class="font-bold typography-headline-3">
        {{ settingsType === 'general-settings' ? 'General Settings' : 'SEO Settings' }}
      </h3>
      <SfIconChevronLeft class="cursor-pointer" @click="closeDrawer" />
    </div>
    <PageSettingsView v-if="settingsType === 'general-settings'" class="mt-2" />

    <SeoView v-if="settingsType === 'seo-settings'" />
  </SfDrawer>
</template>

<script setup lang="ts">
import type { SfDrawerPlacement } from '@storefront-ui/vue';
import { SfDrawer, SfIconChevronLeft } from '@storefront-ui/vue';

const { setSettingsCategory, settingsType } = useSiteConfiguration();

const placement = ref<`${SfDrawerPlacement}`>('left');
const open = ref(true);

const closeDrawer = () => {
  open.value = false;
  setSettingsCategory(null);
};
</script>
