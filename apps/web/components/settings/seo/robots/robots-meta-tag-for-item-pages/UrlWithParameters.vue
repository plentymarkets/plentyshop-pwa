<template>
  <div v-if="runtimeConfig.public.isDev" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel class="mb-1">
        {{ getEditorTranslation('label') }}
        <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
          <SfIconInfo :size="'sm'" />
        </SfTooltip>
      </UiFormLabel>
      <SfSwitch
        v-model="robotsUrlWithParameters"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfSwitch, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('robotsUrlWithParameters');
const runtimeConfig = useRuntimeConfig();

const robotsUrlWithParameters = computed({
  get: () => getSetting() === 'true',
  set: (value) => updateSetting(value.toString()),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Robots for item page URLs with parameters",
    "tooltip": "Controls whether item pages with URL parameters (for example referrers) should be excluded from search indexing (noindex) or follow the default robots setting for item pages."
  },
  "de": {
    "label": "Robots for item page URLs with parameters",
    "tooltip": "Controls whether item pages with URL parameters (for example referrers) should be excluded from search indexing (noindex) or follow the default robots setting for item pages."
  }
}
</i18n>
