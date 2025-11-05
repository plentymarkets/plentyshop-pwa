<template>
  <UiAccordionItem
    v-model="sortFilterOpen"
    data-testid="open-sorting-and-filters-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('display-and-order-label') }}</h2>
    </template>

    <div data-testid="text-card-form">
      <div class="py-4">
        <draggable
          v-if="sortFilterBlock.filtersOrder.length"
          v-model="sortFilterBlock.filtersOrder"
          item-key="meta.uuid"
          handle=".drag-slides-handle"
          class="rounded"
          :filter="'.no-drag'"
        >
          <template #item="{ element: elem, index }: { element: SortFilterFieldKey; index: number }">
            <div :key="elem" class="flex items-center justify-between drag-slides-handle cursor-move">
              <div class="flex items-center gap-3">
                <button
                  class="drag-slides-handle top-2 left-2 z-50 cursor-grab p-2 hover:bg-gray-100 rounded-full"
                  :aria-label="getEditorTranslation('drag-reorder-aria')"
                  :data-testid="`actions-drag-slide-handle-${index}`"
                >
                  <NuxtImg width="18" height="18" :src="dragIcon" />
                </button>

                <span>{{ fieldLabels[elem] }}</span>
              </div>
              <SfSwitch
                v-model="sortFilterBlock.fields[elem]"
                :disabled="sortFilterBlock.filtersDisabled?.includes(elem)"
                :data-testid="`sort-filters-field-${elem}`"
              />
            </div>
          </template>
        </draggable>
      </div>

      <div class="py-2">
        <div class="flex items-center justify-between gap-3">
          <UiFormLabel for="keep-transparent" class="m-0">
            {{ getEditorTranslation('show-filters-immediately-label') }}
          </UiFormLabel>

          <SfSwitch
            id="keep-transparent"
            v-model="sortFilterBlock.showAllFiltersImmediately"
            data-testid="switch-keep-transparent"
            class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          />
        </div>
      </div>

      <div v-if="!sortFilterBlock.showAllFiltersImmediately" class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('number-of-filters-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput
            v-model="sortFilterBlock.numberOfFiltersToShowInitially"
            type="number"
            data-testid="input-number-of-filters"
          >
            <template #suffix>
              <label for="sorting-and-filters-number-of-filters" class="rounded-lg cursor-pointer">
                <input
                  id="sorting-and-filters-number-of-filters"
                  v-model="sortFilterBlock.numberOfFiltersToShowInitially"
                  type="number"
                  class="invisible w-8"
                />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfInput, SfSwitch } from '@storefront-ui/vue';
import type { SortFilterFormProps, SortFilterContent, SortFilterFieldKey } from './types';
import dragIcon from '~/assets/icons/paths/drag.svg';
import draggable from 'vuedraggable/src/vuedraggable';

const route = useRoute();
const { data } = useCategoryTemplate(route?.meta?.identifier as string, route.meta.type as string);

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const sortFilterOpen = ref(true);

const props = defineProps<SortFilterFormProps>();

const sortFilterBlock = computed<SortFilterContent>(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ?? {};

  const content = rawContent as Partial<SortFilterContent>;

  if (!content.showAllFiltersImmediately) content.showAllFiltersImmediately = false;
  if (!content.numberOfFiltersToShowInitially) content.numberOfFiltersToShowInitially = 0;

  return content as SortFilterContent;
});

const fieldLabels: Record<string, string> = {
  category: getEditorTranslation('category'),
  sortBy: getEditorTranslation('sortBy'),
  perPage: getEditorTranslation('perPage'),
  itemRating: getEditorTranslation('itemRating'),
  manufacturer: getEditorTranslation('manufacturer'),
  price: getEditorTranslation('price'),
  availability: getEditorTranslation('availability'),
  customizedFilters: getEditorTranslation('customizedFilters'),
};
</script>

<i18n lang="json">
{
  "en": {
    "display-and-order-label": "Display and order",
    "enable-filters-label": "Enable filters",

    "category": "Category",
    "sortBy": "Sort by",
    "perPage": "Per page",
    "itemRating": "Item rating",
    "manufacturer": "Manufacturer",
    "price": "Price",
    "availability": "Availability",
    "customizedFilters": "Customized filters",

    "show-filters-immediately-label": "Show all filters immediately",
    "number-of-filters-label": "Number of filters to show initially",
    "items-per-page-label": "Items per page"
  },
  "de": {
    "display-and-order-label": "Display and order",

    "category": "Category",
    "sortBy": "Sort by",
    "perPage": "Per page",
    "itemRating": "Item rating",
    "manufacturer": "Manufacturer",
    "price": "Price",
    "availability": "Availability",
    "customizedFilters": "Customized filters",

    "enable-filters-label": "Enable filters",
    "show-filters-immediately-label": "Show all filters immediately",
    "number-of-filters-label": "Number of filters to show initially",
    "items-per-page-label": "Items per page"
  }
}
</i18n>
