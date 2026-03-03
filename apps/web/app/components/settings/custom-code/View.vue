<template>
  <SiteConfigurationView>
    <template #setting-title>
      <div class="flex gap-2 items-center justify-between">
        <span>{{ getEditorTranslation('label') }}</span>
        <SfTooltip
          :label="getEditorTranslation('tooltip')"
          placement="right"
          :show-arrow="true"
          class="flex font-normal mr-2"
        >
          <SfIconHelp class="cursor-pointer" />
        </SfTooltip>
      </div>
    </template>
  </SiteConfigurationView>
</template>

<script setup lang="ts">
import { SfIconHelp, SfTooltip } from '@storefront-ui/vue';
</script>

<i18n lang="json">
{
  "en": {
    "label": "Custom Code",
    "tooltip": "Add custom CSS, JavaScript, meta tags, or libraries to your shop. Code is applied globally and can affect performance and functionality. Use only if you are familiar with CSS/JS/HTML. You are responsible for any impact this code may have on your shop."
  },
  "de": {
    "label": "Custom Code",
    "tooltip": "Add custom CSS, JavaScript, meta tags, or libraries to your shop. Code is applied globally and can affect performance and functionality. Use only if you are familiar with CSS/JS/HTML. You are responsible for any impact this code may have on your shop."
  }
}
</i18n>
