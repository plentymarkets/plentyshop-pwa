<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <EditorCategorySelect
      v-model="shippingTextCategoryId"
      :base-search-params="{ type: 'in:content', sortBy: 'position_asc,name_asc' }"
      data-test-id="shipping-text-category-id"
    />
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const { updateSetting, getSetting } = useSiteSettings('shippingTextCategoryId');

const shippingTextCategoryId = computed({
  get: () => getSetting()?.toString() ?? null,
  set: (value: string | null) => {
    value ? updateSetting(value) : updateSetting('');
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "description": "Select the category whose template data will be used for the /shipping page. By default, this page is also referenced wherever shipping prices are mentioned.",
    "label": "Category for shipping information page",
    "tooltip": "Which category should be used to provide the template for the shipping information?"
  },
  "de": {
    "description": "Select the category whose template data will be used for the /shipping page. By default, this page is also referenced wherever shipping prices are mentioned.",
    "label": "Category for shipping information page",
    "tooltip": "Which category should be used to provide the template for the shipping information?"
  }
}
</i18n>
