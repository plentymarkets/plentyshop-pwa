<template>
  <div class="flex w-full items-center py-2">
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
      <SfCheckbox v-model="isSelected" class="peer" @update:model-value="toggleLocale(locale)" />
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
const isSelected = ref(selectedLocales.value.includes(props.locale));
</script>

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
