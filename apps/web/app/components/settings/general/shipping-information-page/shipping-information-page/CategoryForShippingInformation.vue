<template>
  <div class="py-2">
    <p class="mb-4">{{ getEditorTranslation('description') }}</p>
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

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
      :custom-label="categoryCustomLabel"
      :deselect-label="getEditorTranslation('deselect-label')"
      @search-change="handleSearch"
    />
  </div>
</template>
<script setup lang="ts">
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import Multiselect from 'vue-multiselect';
import type { CategoryEntry } from '@plentymarkets/shop-api';
import type { CategoryOption } from '~/components/settings/general/shipping-information-page/shipping-information-page/types';
const { data, getCategories } = useCategoriesSearch();

const categories = ref<CategoryOption[]>([]);

const baseCategoryParams = {
  type: 'in:content',
  sortBy: 'position_asc,name_asc',
};

const handleSearch = debounce(async (query: string) => {
  const q = query?.trim();
  await getCategories({
    ...baseCategoryParams,
    ...(q ? { name: `like:${q}` } : {}),
  });
}, 500);

const categoryCustomLabel = (opt: CategoryOption) => `[${opt.id}] ${opt.name}`;

onMounted(async () => {
  await getCategories(baseCategoryParams);

  categories.value = data.value.entries.map((category: CategoryEntry) => {
    return {
      id: (category.id ?? 0).toString(),
      name: category.details[0]?.name ?? '',
    };
  });
});

const { updateSetting, getSetting } = useSiteSettings('shippingTextCategoryId');

const shippingTextCategoryId = computed({
  get: () => {
    return categories.value.find((c: CategoryOption) => c.id === getSetting()?.toString()) ?? null;
  },
  set: (value: CategoryOption) => {
    updateSetting(value.id);
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
