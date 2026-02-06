<template>
  <SiteConfigurationView>
    <template #setting-title>{{ getEditorTranslation('label') }}</template>
    <template #setting-description>
      <div class="flex flex-col px-4 text-sm">
        <p class="pb-2">
          <span class="align-middle font-bold">{{ getEditorTranslation('description') }}</span>
        </p>
      </div>
    </template>

    <AssetDrawer v-if="Object.keys(currentAsset).length > 0" />
  </SiteConfigurationView>
</template>

<script setup lang="ts">
import type { Asset } from '@plentymarkets/shop-api';

const { currentAsset, selectAsset } = useCustomAssets();

onBeforeUnmount(() => {
  selectAsset({} as Asset);
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Custom Meta Tags",
    "description": ""
  },
  "de": {
    "label": "Custom Meta Tags",
    "description": ""
  }
}
</i18n>
