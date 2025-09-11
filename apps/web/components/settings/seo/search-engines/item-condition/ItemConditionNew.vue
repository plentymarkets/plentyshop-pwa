<template>
  <div v-if="runtimeConfig.public.isDev" class="py-2">
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
        data-testid="item-condition-new"
        :show-labels="false"
      />
    </label>
  </div>
</template>
<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import { conditionOptions } from '~/utils/editorSettings';

const { updateSetting, getSetting } = useSiteSettings('itemConditionNew');
const runtimeConfig = useRuntimeConfig();

const condition = computed({
  get: () => getSetting(),
  set: (value) => updateSetting(value),
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Item condition: new",
    "placeholder": "Select Item condition"
  },
  "de": {
    "label": "Item condition: new",
    "placeholder": "Select Item condition"
  }
}
</i18n>
