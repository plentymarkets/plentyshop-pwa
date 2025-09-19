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
        v-model="seoRichSnippetBrand"
        :options="Object.keys(seoRichSnippetBrands)"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        data-testid="seo-robots-item-page"
      >
        <template #singleLabel="{ option }">
          {{ seoRichSnippetBrands[option] }}
        </template>
        <template #option="props"> {{ seoRichSnippetBrands[props.option] }} </template>
      </Multiselect>
    </label>
    <div v-if="seoRichSnippetBrand === '3'" class="mt-2">
      <label for="seoRichSnippetBrandId">Enter the ID of the variation property</label>
      <SfInput id="seoRichSnippetBrandId" v-model="seoRichSnippetBrandId" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput, SfIconInfo, SfTooltip  } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import { robotsItemOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('seoRichSnippetBrand');
const { updateSetting: updateSettingForId, getSetting: getSettingForId } = useSiteSettings('seoRichSnippetBrandId');
const runtimeConfig = useRuntimeConfig();

const seoRichSnippetBrand = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});

const seoRichSnippetBrandId = computed({
  get: () => getSettingForId(),
  set: (value) => updateSettingForId(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Select source for the brand in Rich Snippets of the item page",
    "tooltip": "Select source for the brand in Rich Snippets of the item page",
    "placeholder": "Select robots"
  },
  "de": {
    "label": "Select source for the brand in Rich Snippets of the item page",
    "tooltip": "Select source for the brand in Rich Snippets of the item page",
    "placeholder": "Select robots"
  }
}
</i18n>
