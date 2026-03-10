<template>
  <div class="block-form-section">
    <UiAccordionItem
      v-model="searchOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('search-section-label') }}</h2>
      </template>

      <div class="py-2">
        <div class="flex items-center justify-between">
          <UiFormLabel class="mb-1">{{ getEditorTranslation('icon-only-label') }}</UiFormLabel>
          <SfSwitch
            :model-value="searchConfig.displayMode === 'icon-only'"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            @update:model-value="searchConfig.displayMode = $event ? 'icon-only' : 'full'"
          />
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';
import type { SearchSettings, UtilityBarFormProps } from '../types';

const props = defineProps<UtilityBarFormProps>();

const searchOpen = ref(true);
const { content } = useUtilityBarState(props.uuid);

const searchConfig = computed<SearchSettings>({
  get: () => content.value.search,
  set: (newSearchSettings) => {
    content.value = { ...content.value, search: newSearchSettings };
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "search-section-label": "Search Settings",
    "display-mode-label": "Display Mode",
    "display-mode-hint": "Choose how the search bar should be displayed",
    "icon-only-label": "Show Icon Only",
    "full-search-label": "Show Full Input"
  },
  "de": {
    "search-section-label": "Search Settings",
    "display-mode-label": "Display Mode",
    "display-mode-hint": "Choose how the search bar should be displayed",
    "icon-only-label": "Show Icon Only",
    "full-search-label": "Show Full Input"
  }
}
</i18n>
