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
const { currentAsset } = useCustomAssets();
</script>

<i18n lang="json">
{
  "en": {
    "label": "Custom CSS",
    "description": ""
  },
  "de": {
    "label": "Custom CSS",
    "description": ""
  }
}
</i18n>
