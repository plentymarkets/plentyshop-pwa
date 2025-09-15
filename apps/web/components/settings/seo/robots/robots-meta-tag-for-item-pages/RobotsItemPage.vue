<template>
  <div v-if="runtimeConfig.public.isDev" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <Multiselect
        v-model="robotsItemPage"
        :options="robotsOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-robots-item-page"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import { robotsOptions } from '~/utils/editorSettings';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('robotsItemPage');
const runtimeConfig = useRuntimeConfig();

const robotsItemPage = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Robots for item pages",
    "tooltip": "Define the default values for the robots meta value of your item pages. You can use a variation property of the type Text to define a custom value on the level of the variation.",
    "placeholder": "Select robots"
  },
  "de": {
    "label": "Robots for item pages",
    "tooltip": "Define the default values for the robots meta value of your item pages. You can use a variation property of the type Text to define a custom value on the level of the variation.",
    "placeholder": "Select robots"
  }
}
</i18n>
