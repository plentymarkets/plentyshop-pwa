<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    {{ data.entries }}
    <SfInput v-model="shippingTextCategoryId" type="text" data-testid="" />
    <Multiselect
      v-model="shippingTextCategoryId"
      data-testid="shipping-text-category-id"
      :options="categories"
      :placeholder="getEditorTranslation('placeholder')"
      label="name"
      track-by="id"
      :allow-empty="false"
      class="cursor-pointer"
      select-label=""
      :searchable="true"
      :deselect-label="getEditorTranslation('deselect-label')"
    />
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfInput, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import type { CategoryEntry } from '@plentymarkets/shop-api';
const { data, getCategories } = useCategoriesSearch();

const categories = ref([]);

onMounted(async () => {
  await getCategories({
    type: 'in:item,content',
    sortBy: 'position_asc,name_asc',
    with: 'details,clients',
  });

  data.value.entries.forEach((category: CategoryEntry) => {
    const categoryId = category.details[0]?.categoryId;
    const categoryName = category.details[0]?.name;

    console.log(categoryId, categoryName);
  });
});

const { updateSetting, getSetting } = useSiteSettings('shippingTextCategoryId');

const shippingTextCategoryId = computed({
  get: () => getSetting(),
  set: (value) => {
    updateSetting(value);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "description": "Select the category whose template data will be used for the /shipping page. By default, this page is also referenced wherever shipping prices are mentioned.",
    "label": "Category for shipping information page",
    "tooltip": "Which category should be used to provide the template for the shipping information?",
    "placeholder": "Select a category",
    "deselect-label": "Selected"
  },
  "de": {
    "description": "Select the category whose template data will be used for the /shipping page. By default, this page is also referenced wherever shipping prices are mentioned.",
    "label": "Category for shipping information page",
    "tooltip": "Which category should be used to provide the template for the shipping information?",
    "placeholder": "Select a category",
    "deselect-label": "Selected"
  }
}
</i18n>
