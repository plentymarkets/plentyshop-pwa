<template>
  <div class="mt-4">
    <div class="flex justify-between mb-2">
      <UiFormLabel>{{ getEditorTranslation('label') }}</UiFormLabel>
      <SfTooltip :label="getEditorTranslation('tooltip')" :placement="'top'" :show-arrow="true" class="ml-2 z-10">
        <SfIconInfo :size="'sm'" />
      </SfTooltip>
    </div>

    <Multiselect
      v-model="recommendedSecondSortingOption"
      data-testid="recommended-second-sorting-select"
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
import { getRecommendedSortingOptions } from '~/utils/sortingOptionsHelper';

const { updateSetting, getSetting } = useSiteSettings('recommendedSecondSortingOption');

const sortingOptions = computed(() => getRecommendedSortingOptions('en', true));

const recommendedSecondSortingOption = computed({
  get: () => {
    return sortingOptions.value.find((o: SortingOption) => o.value === getSetting());
  },
  set: (option) => {
    updateSetting(option?.value ?? '');
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "label": "Second sorting option",
    "tooltip": "Second sorting option",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  },
  "de": {
    "label": "Second sorting option",
    "tooltip": "Second sorting option",
    "placeholder": "Select default option",
    "deselect-label": "Selected"
  }
}
</i18n>
