<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Background color</UiFormLabel>
      <SfTooltip
        label="If set, this background color will take precedence over your defined primary color for the header."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="headerBackgroundColor" type="text" data-testid="background-icon-color">
        <template #suffix>
          <label
            for="icon-background-color"
            :style="{ backgroundColor: headerBackgroundColor }"
            class="border border-[#a0a0a0] rounded-lg cursor-pointer"
          >
            <input id="icon-background-color" v-model="headerBackgroundColor" type="color" class="invisible w-8" />
          </label>
        </template>
      </SfInput>
      <span class="typography-text-xs text-neutral-700">Choose header background color</span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('headerBackgroundColor');
const { updateHeaderBackgroundColor } = useSiteConfiguration();

const headerBackgroundColor = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);
    updateHeaderBackgroundColor(value);
  },
});
</script>
