<template>
  <SfDrawer
    v-model="open"
    class="category-drawer !absolute ml-[100%] w-max min-w-[300px]"
    :placement="placement"
    :disable-click-away="true"
    :class="[
      'bg-white',
      'p-3',
      'border',
      'border-gray-300',
      { 'max-w-[370px]': placement === 'left' || placement === 'right' },
    ]"
  >
    <div v-if="settingsType === 'general-settings'" class="flex justify-between items-center">
      <h3 class="font-bold typography-headline-3">General Settings</h3>
      <SfIconChevronLeft class="cursor-pointer" @click="closeDrawer" />
    </div>

    <div v-if="settingsType === 'seo-settings'" class="flex justify-between items-center">
      <h3 class="font-bold typography-headline-3">SEO Settings</h3>
      <SfIconChevronLeft class="cursor-pointer" @click="closeDrawer" />
    </div>
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
