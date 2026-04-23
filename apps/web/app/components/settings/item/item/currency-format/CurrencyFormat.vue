<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <EditorOptionsTabs
      v-model="currencyFormat"
      :options="currencyFormatOptions"
      test-id-prefix="editor-currency-format"
    />
  </div>
</template>

<script setup lang="ts">
import type { CurrencyFormat } from './types';

const { updateSetting, getSetting } = useSiteSettings('shopCurrencyFormat');

const currencyFormatOptions = computed(() => [
  {
    value: 'symbol' as CurrencyFormat,
    label: getEditorTranslation('option-symbol-label'),
    subLabel: getEditorTranslation('option-symbol-sublabel'),
  },
  {
    value: 'code' as CurrencyFormat,
    label: getEditorTranslation('option-iso-code-label'),
    subLabel: getEditorTranslation('option-iso-code-sublabel'),
  },
]);

const currencyFormat = computed<CurrencyFormat>({
  get: () => (getSetting() as CurrencyFormat) || 'symbol',
  set: (value: CurrencyFormat) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "description": "Which currency format do you want to use in the shop?",
    "option-symbol-label": "Symbol",
    "option-symbol-sublabel": "(e.g. €)",
    "option-iso-code-label": "ISO Code",
    "option-iso-code-sublabel": "(e.g. EUR)"
  },
  "de": {
    "description": "Which currency format do you want to use in the shop?",
    "option-symbol-label": "Symbol",
    "option-symbol-sublabel": "(e.g. €)",
    "option-iso-code-label": "ISO Code",
    "option-iso-code-sublabel": "(e.g. EUR)"
  }
}
</i18n>
