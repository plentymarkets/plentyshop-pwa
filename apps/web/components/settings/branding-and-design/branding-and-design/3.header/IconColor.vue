<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>Icon color</UiFormLabel>
      <SfTooltip
        label="Use this to override the default white icon color in the header, ensuring sufficient contrast with your chosen background."
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <SfInput v-model="iconColor" type="text" data-testid="icon-color">
        <template #suffix>
          <label
            for="icon-color"
            :style="{ backgroundColor: iconColor }"
            class="border border-[#a0a0a0] rounded-lg cursor-pointer"
          >
            <input id="icon-color" v-model="iconColor" type="color" class="invisible w-8" />
          </label>
        </template>
      </SfInput>
      <span class="typography-text-xs text-neutral-700">Choose icon color</span>
    </label>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('iconColor');

const iconColor = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>
