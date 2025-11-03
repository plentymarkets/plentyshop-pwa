<template>
  <UiAccordionItem
    v-model="layoutOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2 data-testid="sort-form-layout-label">{{ getEditorTranslation('layout-label') }}</h2>
    </template>
    <div class="py-2 flex items-center justify-between gap-3">
      <UiFormLabel for="show-placeholder" class="m-0">
        {{ getEditorTranslation('show-selectionModeAlways-label') }}
      </UiFormLabel>
      <SfSwitch
        id="show-placeholder"
        v-model="sortBlock.settings.selectionModeAlways"
        data-testid="switch-sort-placeholder"
      />
    </div>
    <div id="sort-form-padding-form" class="py-2">
      <div class="flex items-center gap-2 mb-2">
        <UiFormLabel class="m-0">{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      </div>

      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="sortBlock.layout.paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="sort-form-padding-top"
          />
        </div>

        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="sortBlock.layout.paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="sort-form-padding-bottom"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="sortBlock.layout.paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="sort-form-padding-left"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="sortBlock.layout.paddingRight"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="sort-form-padding-right"
          />
        </div>
      </div>
    </div>
  </UiAccordionItem>
</template>
<script setup lang="ts">
import {
  SfIconArrowBack,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfIconArrowUpward,
  SfSwitch,
} from '@storefront-ui/vue';
import type { SortContent, SortFormProps } from '~/components/blocks/Sort/types';

const props = defineProps<SortFormProps>();

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const sortBlock = computed<SortContent>(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ?? {};

  const content = rawContent as Partial<SortContent>;

  if (!content.settings) {
    content.settings = { selectionModeAlways: false };
  }
  if (!content.layout) {
    content.layout = {
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    };
  }

  return content as SortContent;
});

const layoutOpen = ref(false);
</script>

<i18n lang="json">
{
  "en": {
    "layout-label": "Layout",
    "padding-label": "Padding",
    "show-selectionModeAlways-label": "Compact mode"
  },
  "de": {
    "layout-label": "Layout",
    "padding-label": "Padding",
    "show-selectionModeAlways-label": "Compact mode"
  }
}
</i18n>
