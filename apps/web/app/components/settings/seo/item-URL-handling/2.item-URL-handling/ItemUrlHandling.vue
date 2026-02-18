<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>

    <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
      <div
        class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
        data-testid="button-item-url-handling-modern"
        :class="{ 'bg-gray-100 text-gray-900 font-semibold': urlScheme === false }"
        @click="urlScheme = false"
      >
        <SfIconCheck :class="{ invisible: urlScheme === true }" class="mr-1 w-[1.1rem]" />
        {{ getEditorTranslation('button-modern-label') }}
      </div>

      <div
        class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
        data-testid="button-item-url-handling-legacy"
        :class="{ 'bg-gray-100 text-gray-900 font-semibold': urlScheme === true }"
        @click="urlScheme = true"
      >
        <SfIconCheck :class="{ invisible: urlScheme === false }" class="mr-1 w-[1.1rem]" />
        {{ getEditorTranslation('button-legacy-label') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconCheck } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('enableCallistoUrlScheme');

const urlScheme = computed({
  get: () => {
    const val = getSetting();
    return String(val) === 'true';
  },
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Item URL Scheme",
    "button-modern-label": "Modern",
    "button-legacy-label": "Legacy"
  },
  "de": {
    "label": "Item URL Scheme",
    "button-modern-label": "Modern",
    "button-legacy-label": "Legacy"
  }
}
</i18n>