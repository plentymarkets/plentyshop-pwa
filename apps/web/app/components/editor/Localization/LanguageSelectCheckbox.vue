<template>
  <div
    v-memo="[isSelected, translatedCount.translated, translatedCount.total]"
    class="flex w-full items-center py-2 checkbox-container"
  >
    <div class="mr-auto">
      <div class="text-lg">{{ lang }}</div>
      <div
        class="text-sm text-gray-600"
        :class="{ '!text-red-600': translatedCount.total > translatedCount.translated }"
      >
        {{
          getEditorTranslation('keysTranslated', {
            translated: translatedCount.translated,
            total: translatedCount.total,
          })
        }}
      </div>
    </div>
    <div>
      <SfCheckbox :model-value="isSelected" class="peer" @update:model-value="handleToggle" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfCheckbox } from '@storefront-ui/vue';
import type { LanguageSelectCheckboxProps } from './types';

const { getTranslatedCount } = useEditorLocalizationKeys();
const { toggleLocale, selectedLocales } = useEditorLocalizationLocales();
const props = defineProps<LanguageSelectCheckboxProps>();
const translatedCount = computed(() => getTranslatedCount(props.locale));
const isSelected = computed(() => selectedLocales.value.includes(props.locale));

// Batched updates with nextTick to reduce re-renders
const handleToggle = async () => {
  toggleLocale(props.locale);
  await nextTick();
};
</script>

<style scoped>
/* CSS Containment for checkbox container */
.checkbox-container {
  contain: layout style paint;
}
</style>

<i18n lang="json">
{
  "en": {
    "keysTranslated": "{translated}/{total} keys translated"
  },
  "de": {
    "keysTranslated": "{translated}/{total} keys translated"
  }
}
</i18n>