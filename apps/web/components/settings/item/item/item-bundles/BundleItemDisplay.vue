<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <SfSelect v-model="selectedBundleOption" data-testid="editor-bundleSettings-select" class="w-full">
        <option
          v-for="bundleOption in bundleSettingsOptions"
          :key="bundleOption.key"
          :value="bundleOption.key"
          class="font-medium text-sm md:text-base"
        >
          {{ getEditorTranslation('option-' + bundleOption.key + '-label') }}
        </option>
      </SfSelect>
    </label>
  </div>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('dontSplitItemBundle');

const bundleSettingsOptions = ref([
  {
    key: '0',
    text: 'Only list the components of the item bundle and replace the item bundle with the basic items in the order process',
  },
  {
    key: '1',
    text: 'Only show item bundle without individual components and do not split the item bundle in the order process',
  },
  { key: '2', text: 'List both the item bundle and its individual components' },
]);

const selectedBundleOption = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Bundle presentation and behaviour in the basket.",
    "description": "Control how item bundles are presented on product pages and in the basket, and how they behave when added to the basket.",
    "option-0-label": "Only list the components of the item bundle and replace the item bundle with the basic items in the order process",
    "option-1-label": "Only show item bundle without individual components and do not split the item bundle in the order process",
    "option-2-label": "List both the item bundle and its individual components"
  },
  "de": {
    "label": "Bundle presentation and behaviour in the basket.",
    "description": "Control how item bundles are presented on product pages and in the basket, and how they behave when added to the basket.",
    "option-0-label": "Only list the components of the item bundle and replace the item bundle with the basic items in the order process",
    "option-1-label": "Only show item bundle without individual components and do not split the item bundle in the order process",
    "option-2-label": "List both the item bundle and its individual components"
  }
}
</i18n>
