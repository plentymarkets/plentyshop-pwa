<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">
        {{ getEditorTranslation('label') }}
      </UiFormLabel>
      <SfSwitch
        v-model="registerCookieAsOptOut"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('registerCookieAsOptOut');

const registerCookieAsOptOut = computed({
  get: () => getSetting() === 'true',
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Register Cookie as opt-out"
  },
  "de": {
    "label": "Register Cookie as opt-out"
  }
}
</i18n>
