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
        :options="Object.keys(robotsItemOptions)"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        data-testid="seo-robots-item-page"
      >
        <template #singleLabel="{ option }">
          {{ robotsItemOptions[option] }}
        </template>
        <template #option="props"> {{ robotsItemOptions[props.option] }} </template>
      </Multiselect>
    </label>
    <div v-if="robotsItemPage === 'varProp'" class="mt-2">
      <label for="robotsItemPageId">ID from property of type 'Text'</label>
      <SfInput id="robotsItemPageId" v-model="robotsItemPageId" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip  } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { robotsItemOptions } from '~/utils/editorSettings';
import type { SettingOption } from '~/utils/editorSettings';

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
