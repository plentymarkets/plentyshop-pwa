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

      <div class="space-y-4 py-4">
        <div>
          <UiFormLabel class="mb-2">{{ getEditorTranslation('display-mode-label') }}</UiFormLabel>
          <p class="text-xs text-gray-500 mb-3">{{ getEditorTranslation('display-mode-hint') }}</p>

          <div class="flex gap-2">
            <button
              :class="[
                'flex-1 px-4 py-2 rounded-md border transition-colors',
                searchConfig.displayMode === 'icon-only'
                  ? 'bg-editor-button text-white border-editor-button'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400',
              ]"
              @click="searchConfig.displayMode = 'icon-only'"
            >
              {{ getEditorTranslation('icon-only-label') }}
            </button>
            <button
              :class="[
                'flex-1 px-4 py-2 rounded-md border transition-colors',
                searchConfig.displayMode === 'full'
                  ? 'bg-editor-button text-white border-editor-button'
                  : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400',
              ]"
              @click="searchConfig.displayMode = 'full'"
            >
              {{ getEditorTranslation('full-search-label') }}
            </button>
          </div>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { useBlockManager } from '~/composables/useBlockManager';
import { useBlockTemplates } from '~/composables/useBlockTemplates';
import type { UtilityBarProps, SearchSettings } from './types';

const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const searchOpen = ref(true);

const utilityBarBlock = computed<UtilityBarProps>(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as UtilityBarProps,
);

const searchConfig = computed<SearchSettings>({
  get: () => utilityBarBlock.value.configuration?.search || { displayMode: 'full' },
  set: (value) => {
    if (utilityBarBlock.value.configuration) {
      utilityBarBlock.value.configuration.search = value;
    }
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "search-section-label": "Search Settings",
    "display-mode-label": "Display Mode",
    "display-mode-hint": "Choose how the search bar should be displayed",
    "icon-only-label": "Icon Only",
    "full-search-label": "Full Search Input"
  },
  "de": {
    "search-section-label": "Sucheinstellungen",
    "display-mode-label": "Anzeigemodus",
    "display-mode-hint": "Wählen Sie, wie die Suchleiste angezeigt werden soll",
    "icon-only-label": "Nur Symbol",
    "full-search-label": "Vollständige Suche"
  }
}
</i18n>
