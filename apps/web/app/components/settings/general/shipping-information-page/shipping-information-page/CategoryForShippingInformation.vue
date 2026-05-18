<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
    </div>

    <EditorCategorySelect
      v-model="shippingTextCategoryId"
      :base-search-params="{ type: 'in:content', sortBy: 'position_asc,name_asc' }"
      data-test-id="shipping-text-category-id"
    />
  </div>
</template>
<script setup lang="ts">
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
    "description": "Select the category which should be used for the /shipping page. This page is by default linked wherever shipping prices are mentioned.",
    "label": "Category for shipping information page"
  },
  "de": {
    "description": "Select the category which should be used for the /shipping page. This page is by default linked wherever shipping prices are mentioned.",
    "label": "Category for shipping information page"
  }
}
</i18n>
