<template>
  <div class="py-2 mb-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
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

    <div class="mt-5">
      <span class="font-mono text-sm bg-gray-100 font-weight-bold px-1 py-1 rounded-md">
        {{
          urlScheme ? getEditorTranslation('description-legacy-code') : getEditorTranslation('description-modern-code')
        }}
      </span>
      <p class="my-3 font-semibold">
        {{
          urlScheme
            ? getEditorTranslation('description-legacy-body-one')
            : getEditorTranslation('description-modern-body-one')
        }}
      </p>
      <ul class="list-inside list-disc">
        <li>
          {{
            urlScheme
              ? getEditorTranslation('description-legacy-body-list-line-one')
              : getEditorTranslation('description-modern-body-list-line-one')
          }}
        </li>
        <li>
          {{
            urlScheme
              ? getEditorTranslation('description-legacy-body-list-line-two')
              : getEditorTranslation('description-modern-body-list-line-two')
          }}
        </li>
        <li>
          {{
            urlScheme
              ? getEditorTranslation('description-legacy-body-list-line-three')
              : getEditorTranslation('description-modern-body-list-line-three')
          }}
        </li>
        <li>
          {{
            urlScheme
              ? getEditorTranslation('description-legacy-body-list-line-four')
              : getEditorTranslation('description-modern-body-list-line-four')
          }}
        </li>
      </ul>
      <p class="my-3">
        {{
          urlScheme
            ? getEditorTranslation('description-legacy-body-footer')
            : getEditorTranslation('description-modern-body-footer')
        }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconCheck, SfTooltip, SfIconInfo } from '@storefront-ui/vue';

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
    "tooltip": "Defines whether item variants get their own URL or share the same URL",
    "button-modern-label": "Modern",
    "button-legacy-label": "Legacy",

    "description-modern-code": "Example: /item-name_itemID_itemVariantID",
    "description-modern-body-one": "Use when variants should be individually discoverable.",
    "description-modern-body-list-line-one": "Each variant gets its own URL",
    "description-modern-body-list-line-two": "Enables direct linking to specific variants",
    "description-modern-body-list-line-three": "Supports variant-level SEO potential",
    "description-modern-body-list-line-four": "Useful for campaigns or ads targeting a specific option",
    "description-modern-body-footer": "This is ideal when variants differ meaningfully (e.g. material, features, item texts, images) or when you want users and search engines to land directly on a preselected variant.",

    "description-legacy-code": "Example: /item-name/a-variantID",
    "description-legacy-body-one": "Use when variants are mostly cosmetic and SEO simplicity matters.",
    "description-legacy-body-list-line-one": "One shared URL for all variants",
    "description-legacy-body-list-line-two": "Prevents duplicate or near-identical pages",
    "description-legacy-body-list-line-three": "Consolidates SEO signals to a single product page",
    "description-legacy-body-list-line-four": "Simplifies analytics and maintenance",
    "description-legacy-body-footer": "Best suited when variants don’t have unique content or search demand and you prefer stronger authority on one page over variant-level linking."
  },
  "de": {
    "label": "Item URL Scheme",
    "tooltip": "Defines whether item variants get their own URL or share the same URL",
    "button-modern-label": "Modern",
    "button-legacy-label": "Legacy",

    "description-modern-code": "Example: /item-name_itemID_itemVariantID",
    "description-modern-body-one": "Use when variants should be individually discoverable.",
    "description-modern-body-list-line-one": "Each variant gets its own URL",
    "description-modern-body-list-line-two": "Enables direct linking to specific variants",
    "description-modern-body-list-line-three": "Supports variant-level SEO potential",
    "description-modern-body-list-line-four": "Useful for campaigns or ads targeting a specific option",
    "description-modern-body-footer": "This is ideal when variants differ meaningfully (e.g. material, features, item texts, images) or when you want users and search engines to land directly on a preselected variant.",

    "description-legacy-code": "Example: /item-name/a-variantID",
    "description-legacy-body-one": "Use when variants are mostly cosmetic and SEO simplicity matters.",
    "description-legacy-body-list-line-one": "One shared URL for all variants",
    "description-legacy-body-list-line-two": "Prevents duplicate or near-identical pages",
    "description-legacy-body-list-line-three": "Consolidates SEO signals to a single product page",
    "description-legacy-body-list-line-four": "Simplifies analytics and maintenance",
    "description-legacy-body-footer": "Best suited when variants don’t have unique content or search demand and you prefer stronger authority on one page over variant-level linking."
  }
}
</i18n>
