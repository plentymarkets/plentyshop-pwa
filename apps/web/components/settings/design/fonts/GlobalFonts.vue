<template>
  <div class="">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Global fonts</UiFormLabel>
      <SfTooltip
        label="The shop supports Google Fonts. Fonts are downloaded during the build process. This means the shop does not connect to Google while the shop is running."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="font"
      data-testid="font-select"
      :options="fonts"
      placeholder="Select a font"
      label="value"
      track-by="caption"
      :allow-empty="false"
      class="cursor-pointer"
      select-label=""
      deselect-label="Selected"
    />
    <span class="typography-text-xs text-neutral-700">Choose one Google font for all texts</span>
  </div>
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import { FontSetting } from '~/composables/useSiteSettings';

const fonts = ref([]);

onMounted(async () => {
  const response = await fetch('/_nuxt-plenty/editor/fonts.json');

  if (response.ok) {
    fonts.value = await response.json();
  }
});

const { updateSetting, getSetting } = useSiteSettings('font');

const font = computed({
  get: () => {
    return fonts.value.find((f: FontSetting) => f.value === getSetting()) ?? {};
  },
  set: (value: FontSetting) => {
    console.log('update value: ', value);
    updateSetting(value.value);
  },
});
</script>
