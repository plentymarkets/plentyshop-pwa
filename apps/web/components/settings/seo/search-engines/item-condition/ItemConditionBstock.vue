<template>
  <div v-if="runtimeConfig.public.isDev" class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>
    <label>
      <Multiselect
        v-model="condition"
        :options="conditionOptions"
        :placeholder="getEditorTranslation('placeholder')"
        :searchable="false"
        :allow-empty="false"
        data-testid="seo-b-stock"
        :show-labels="false"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import { conditionOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('itemConditionBStock');
const runtimeConfig = useRuntimeConfig();

const condition = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Item condition: B-Stock",
    "description": "Map the conditions you defined in your backend to the conditions defined by Schema.org. That way, webcrawlers are able to better evaluate your condition information.",
    "placeholder": "Item condition: B-Stock"
  },
  "de": {
    "label": "Item condition: B-Stock",
    "description": "Map the conditions you defined in your backend to the conditions defined by Schema.org. That way, webcrawlers are able to better evaluate your condition information.",
    "placeholder": "Item condition: B-Stock"
  }
}
</i18n>
