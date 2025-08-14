<template>
  <UiFormLabel>
    {{ getEditorTranslation('label') }}
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
  </UiFormLabel>
</template>

<script setup lang="ts">
import { SfSelect } from '@storefront-ui/vue';
const { updateSetting, getSetting } = useSiteSettings('bundleItemDisplay');

const bundleSettingsOptions = ref([
  { key: '0', text: 'Only list the components of the item bundle and replace the item bundle with the basic items in the order process' },
  { key: '1', text: 'Only show item bundle without individual components and do not split the item bundle in the order process' },
  { key: '2', text: 'List both the item bundle and its individual components' }
]);

const selectedBundleOption = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "How do you want to display item bundles in checkout?",
    "option-0-label": "Only list the components of the item bundle and replace the item bundle with the basic items in the order process",
    "option-1-label": "Only show item bundle without individual components and do not split the item bundle in the order process",
    "option-2-label": "List both the item bundle and its individual components"
  },
  "de": {
    "label": "How do you want to display item bundles in checkout?",
    "option-0-label": "Only list the components of the item bundle and replace the item bundle with the basic items in the order process",
    "option-1-label": "Only show item bundle without individual components and do not split the item bundle in the order process",
    "option-2-label": "List both the item bundle and its individual components"
  }
}
</i18n>
