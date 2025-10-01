<template>
  <div class="py-2">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>

      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>
    <label>
      <Multiselect
        v-model="seoRichSnippetManufacturer"
        :options="Object.keys(seoRichSnippetManufacturers)"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        data-testid="seo-manufacturer"
      >
        <template #singleLabel="{ option }">
          {{ seoRichSnippetManufacturers[option] }}
        </template>
        <template #option="props"> {{ seoRichSnippetManufacturers[props.option] }} </template>
      </Multiselect>
    </label>
  </div>
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import { seoRichSnippetManufacturers } from '~/utils/editorSettings';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetManufacturer');

const seoRichSnippetManufacturer = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for the manufacturer in Rich Snippets of the item page",
    "tooltip": "Select source for the manufacturer in Rich Snippets of the item page",
    "placeholder": "Select robots"
  },
  "de": {
    "label": "Select source for the manufacturer in Rich Snippets of the item page",
    "tooltip": "Select source for the manufacturer in Rich Snippets of the item page",
    "placeholder": "Select robots"
  }
}
</i18n>
