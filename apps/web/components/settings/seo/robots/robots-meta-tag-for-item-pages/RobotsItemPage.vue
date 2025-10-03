<template>
  <div v-if="runtimeConfig.public.isDev" class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="robotsItemPage"
      data-testid="seo-brand"
      :options="robotsItemOptions"
      :placeholder="getEditorTranslation('placeholder')"
      :allow-empty="false"
      class="cursor-pointer"
      deselect-label="Selected"
    >
      <template #singleLabel="{ option }">
        {{ getEditorTranslation('robotsItemPage-' + option) }}
      </template>
      <template #option="props">
        {{ getEditorTranslation('robotsItemPage-' + props.option) }}
      </template>
    </Multiselect>

    <div v-if="robotsItemPage === 'varProp'" class="mt-2">
      <label for="robotsItemPageId">
        {{ getEditorTranslation('conditionalLabel') }}
      </label>
      <SfInput id="robotsItemPageId" v-model="robotsItemPageId" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
const robotsItemOptions = ref(['all', 'noindex', 'nofollow', 'noindex nofollow', 'varProp']);

const { updateSetting, getSetting } = useSiteSettings('robotsItemPage');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } = useSiteSettings('robotsItemPageId');
const runtimeConfig = useRuntimeConfig();

const robotsItemPage = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const robotsItemPageId = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select Robots for single item views",
    "tooltip": "Define the default values for the robots meta value of your item pages. You can use a variation property of the type Text to define a custom value on the level of the variation.",
    "placeholder": "Select robots",
    "conditionalLabel": "ID from property of type 'Text'",
    "robotsItemPage-all": "all",
    "robotsItemPage-noindex": "noindex",
    "robotsItemPage-nofollow": "nofollow",
    "robotsItemPage-noindex nofollow": "noindex nofollow",
    "robotsItemPage-varProp": "Selection via variation property of the type 'Text'. Default value = 'all'"
  },
  "de": {
    "label": "Select Robots for single item views",
    "tooltip": "Define the default values for the robots meta value of your item pages. You can use a variation property of the type Text to define a custom value on the level of the variation.",
    "placeholder": "Select robots",
    "conditionalLabel": "ID from property of type 'Text'",
    "robotsItemPage-all": "all",
    "robotsItemPage-noindex": "noindex",
    "robotsItemPage-noindex nofollow": "noindex nofollow",
    "robotsItemPage-varProp": "Selection via variation property of the type 'Text'. Default value = 'all'"
  }
}
</i18n>
