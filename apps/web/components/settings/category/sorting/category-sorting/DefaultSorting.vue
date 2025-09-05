<template>
  <div class="mt-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip
        :label="getEditorTranslation('tooltip')"
        :placement="'top'"
        :show-arrow="true"
        class="ml-2 z-10"
        data-testid="default-sorting-tooltip"
      >
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="defaultSortingOption"
      data-testid="default-sorting-select"
      :options="sortingOptions"
      :placeholder="getEditorTranslation('placeholder')"
      label="label"
      track-by="value"
      class="cursor-pointer"
      select-label=""
      :deselect-label="getEditorTranslation('deselect-label')"
      :allow-empty="true"
    />
  </div>
</template>

<script setup lang="ts">
import 'vue-multiselect/dist/vue-multiselect.min.css';
import Multiselect from 'vue-multiselect';
import { SfIconInfo, SfTooltip } from '@storefront-ui/vue';
import type { SortingOption } from '~/components/settings/category/sorting/category-sorting/types';
import { getMappedOptions } from '~/utils/sortingOptionsHelper';

const { updateSetting, getSetting } = useSiteSettings('defaultSortingOption');
const { getJsonSetting: availableSortingOptions } = useSiteSettings('availableSortingOptions');
const { updateSorting } = useCategoryFilter();

const sortingOptions = computed(() => getMappedOptions(availableSortingOptions()));

const defaultSortingOption = computed({
  get: () => {
    return sortingOptions.value.find((o: SortingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
    if (useNuxtApp().$router.currentRoute.value.meta.type === 'category') {
      updateSorting(option?.value ?? '');
    }
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Default sorting",
    "tooltip": "Which sorting option do you want to preselect by default for the category page?",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Default sorting",
    "tooltip": "Which sorting option do you want to preselect by default for the category page?",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
