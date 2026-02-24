<template>
  <div v-if="runtimeConfig.enableCallistoUrlScheme" class="py-2 mb-2">
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

  <div v-else>
    <div class="rounded-md bg-amber-50 p-4 shadow-sm">
      <p class="text-sm text-center font-medium text-amber-800">
        {{ getEditorTranslation('info-text') }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconCheck, SfTooltip, SfIconInfo } from '@storefront-ui/vue';
const runtimeConfig = useRuntimeConfig().public;

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

    "description-modern-code": "Example: /item-name_itemID_variantID",
    "description-modern-body-one": "Recommended if you use price comparison platforms like Google Shopping or want variants to be individually discoverable.",
    "description-modern-body-list-line-one": "Each variant gets its own URL",
    "description-modern-body-list-line-two": "Enables direct linking to specific variants",
    "description-modern-body-list-line-three": "Supports variant-level SEO potential",
    "description-modern-body-list-line-four": "Safer when variants have different prices",
    "description-modern-body-footer": "Price comparison platforms expect the landing page price to match the submitted feed price. With separate URLs, each variant links directly to the correct price — avoiding mismatches and potential product disapprovals. Best suited when variants differ meaningfully (e.g. price, features, texts, images) or when users and search engines should land on a preselected variant.",

    "description-legacy-code": "Example: /item-name/a-itemID",
    "description-legacy-body-one": "Use with caution if variants have different prices.",
    "description-legacy-body-list-line-one": "One shared URL for all variants",
    "description-legacy-body-list-line-two": "Prevents duplicate or near-identical pages",
    "description-legacy-body-list-line-three": "Consolidates SEO signals to a single product page",
    "description-legacy-body-list-line-four": "Simplifies analytics and maintenance",
    "description-legacy-body-footer": "Since the page loads one default variant, price comparison platforms like Google Shopping may see a different price than the one submitted in your feed if variants differ. This can lead to price mismatch errors or product disapprovals. Best suited when variants are mostly cosmetic or share the same price.",
    "info-text": "This setting is currently under development"
  },
  "de": {
    "label": "Item URL Scheme",
    "tooltip": "Defines whether item variants get their own URL or share the same URL",
    "button-modern-label": "Modern",
    "button-legacy-label": "Legacy",

    "description-modern-code": "Example: /item-name_itemID_variantID",
    "description-modern-body-one": "Recommended if you use price comparison platforms like Google Shopping or want variants to be individually discoverable.",
    "description-modern-body-list-line-one": "Each variant gets its own URL",
    "description-modern-body-list-line-two": "Enables direct linking to specific variants",
    "description-modern-body-list-line-three": "Supports variant-level SEO potential",
    "description-modern-body-list-line-four": "Safer when variants have different prices",
    "description-modern-body-footer": "Price comparison platforms expect the landing page price to match the submitted feed price. With separate URLs, each variant links directly to the correct price — avoiding mismatches and potential product disapprovals. Best suited when variants differ meaningfully (e.g. price, features, texts, images) or when users and search engines should land on a preselected variant.",

    "description-legacy-code": "Example: /item-name/a-itemID",
    "description-legacy-body-one": "Use with caution if variants have different prices.",
    "description-legacy-body-list-line-one": "One shared URL for all variants",
    "description-legacy-body-list-line-two": "Prevents duplicate or near-identical pages",
    "description-legacy-body-list-line-three": "Consolidates SEO signals to a single product page",
    "description-legacy-body-list-line-four": "Simplifies analytics and maintenance",
    "description-legacy-body-footer": "Since the page loads one default variant, price comparison platforms like Google Shopping may see a different price than the one submitted in your feed if variants differ. This can lead to price mismatch errors or product disapprovals. Best suited when variants are mostly cosmetic or share the same price.",
    "info-text": "This setting is currently under development"
  }
}
</i18n>
