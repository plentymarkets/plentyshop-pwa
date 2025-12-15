<template>
  <UiAccordionItem
    v-model="textOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="item-data-text"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('text-settings-label') }}</h2>
    </template>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('main-title-label') }}</UiFormLabel>
      </div>
      <SfInput v-model="itemTableBlock.text.title" type="text" data-testid="item-data-main-title" />
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="fieldsOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="item-table-fields"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('item-table-section-label') }}</h2>
    </template>

    <div class="py-4">
      <UiFormLabel class="block mb-4">
        {{ getEditorTranslation('elements-display-order') }}
      </UiFormLabel>

      <draggable
        v-model="itemTableBlock.fieldsOrder"
        item-key="element"
        handle=".drag-handle"
        class="rounded space-y-3"
      >
        <template #item="{ element, index }: { element: ItemDataFieldKey; index: number }">
          <div
            :key="element"
            class="flex items-center justify-between cursor-move"
            :data-testid="`item-table-field-${element}`"
          >
            <div class="flex items-center gap-3">
              <button
                class="drag-handle cursor-grab p-2 hover:bg-gray-100 rounded-full"
                :aria-label="getEditorTranslation('drag-reorder-aria')"
                :data-testid="`actions-drag-field-handle-${index}`"
              >
                <NuxtImg width="18" height="18" :src="dragIcon" />
              </button>

              <span>{{ fieldLabels[element] }}</span>
            </div>

            <SfSwitch v-model="itemTableBlock.fields[element]" :data-testid="`item-table-visible-${element}`" />
          </div>
        </template>
      </draggable>
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="layoutOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="item-table-layout"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('layout-settings-label') }}</h2>
    </template>

    <div class="py-2">
      <div class="flex justify-between my-3">
        <span>{{ getEditorTranslation('display-as-collapsable') }}</span>
        <SfSwitch v-model="isCollapsible" :disabled="!hasTitle" data-testid="item-data-displayAsCollapsable-switch" />
      </div>

      <div class="flex justify-between mb-4">
        <span>{{ getEditorTranslation('initially-collapsed') }}</span>
        <SfSwitch
          v-model="isInitiallyCollapsed"
          :disabled="!hasTitle || !isCollapsible"
          data-testid="item-data-initiallyCollapsed-switch"
        />
      </div>

      <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />

      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300 mt-1">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="itemTableBlock.layout.paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="itemTableBlock.layout.paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="itemTableBlock.layout.paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="itemTableBlock.layout.paddingRight"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-right"
          />
        </div>
      </div>
      <div class="px-4 py-3">
        <span class="typography-text-xs text-neutral-700">
          {{ getEditorTranslation('spacing-around') }}
        </span>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import draggable from 'vuedraggable';
import {
  SfInput,
  SfSwitch,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfIconArrowBack,
} from '@storefront-ui/vue';
import dragIcon from 'assets/icons/paths/drag.svg';
import type { ItemDataContent, ItemDataFieldKey, ItemDataFieldLabels } from './types';

const route = useRoute();

const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<{
  uuid?: string;
}>();

const ALL_KEYS: ItemDataFieldKey[] = [
  'itemId',
  'condition',
  'ageRating',
  'externalVariationId',
  'model',
  'manufacturer',
  'manufacturingCountry',
  'content',
  'grossWeight',
  'netWeight',
  'dimensions',
  'customTariffNumber',
  'properties',
];

const rawContent = (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ??
  {}) as Partial<ItemDataContent>;

if (!rawContent.text) {
  rawContent.text = { title: 'More details' };
} else if (rawContent.text.title === undefined) {
  rawContent.text.title = 'More details';
}

if (!rawContent.fields) {
  rawContent.fields = {} as ItemDataContent['fields'];
}
ALL_KEYS.forEach((key) => {
  if (rawContent.fields![key] === undefined) {
    rawContent.fields![key] = true;
  }
});

if (!rawContent.fieldsOrder || !rawContent.fieldsOrder.length) {
  rawContent.fieldsOrder = [...ALL_KEYS];
}

if (!rawContent.layout) {
  rawContent.layout = {
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    displayAsCollapsable: false,
    initiallyCollapsed: false,
    fullWidth: false,
  };
} else {
  rawContent.layout.paddingTop ??= 0;
  rawContent.layout.paddingBottom ??= 0;
  rawContent.layout.paddingLeft ??= 0;
  rawContent.layout.paddingRight ??= 0;
  rawContent.layout.displayAsCollapsable ??= false;
  rawContent.layout.initiallyCollapsed ??= false;
  rawContent.layout.fullWidth ??= false;
}

const itemTableBlock = reactive(rawContent as ItemDataContent);

const { isFullWidth } = useFullWidthToggleForContent(toRef(itemTableBlock));

const fieldLabels: ItemDataFieldLabels = {
  itemId: getEditorTranslation('field-itemId'),
  condition: getEditorTranslation('field-condition'),
  ageRating: getEditorTranslation('field-ageRating'),
  externalVariationId: getEditorTranslation('field-externalVariationId'),
  model: getEditorTranslation('field-model'),
  manufacturer: getEditorTranslation('field-manufacturer'),
  manufacturingCountry: getEditorTranslation('field-manufacturingCountry'),
  content: getEditorTranslation('field-content'),
  grossWeight: getEditorTranslation('field-grossWeight'),
  netWeight: getEditorTranslation('field-netWeight'),
  dimensions: getEditorTranslation('field-dimensions'),
  customTariffNumber: getEditorTranslation('field-customTariffNumber'),
  properties: getEditorTranslation('field-properties'),
};

const textOpen = ref(true);
const fieldsOpen = ref(true);
const layoutOpen = ref(false);

const isCollapsible = ref(itemTableBlock.layout.displayAsCollapsable ?? false);
const isInitiallyCollapsed = ref(itemTableBlock.layout.initiallyCollapsed ?? false);

const hasTitle = computed(() => {
  const title = itemTableBlock.text?.title;
  return !!title && title.trim().length > 0;
});

watch(
  () => itemTableBlock.text.title,
  (newTitle) => {
    const hasAnyTitle = !!newTitle && newTitle.trim().length > 0;

    if (!hasAnyTitle) {
      isCollapsible.value = false;
      isInitiallyCollapsed.value = false;
      itemTableBlock.layout.displayAsCollapsable = false;
      itemTableBlock.layout.initiallyCollapsed = false;
    }
  },
);

watch(isCollapsible, (newValue) => {
  if (!hasTitle.value) {
    if (isCollapsible.value !== false) {
      isCollapsible.value = false;
    }
    itemTableBlock.layout.displayAsCollapsable = false;
    return;
  }

  itemTableBlock.layout.displayAsCollapsable = newValue;

  if (!newValue) {
    isInitiallyCollapsed.value = false;
    itemTableBlock.layout.initiallyCollapsed = false;
  }
});

watch(isInitiallyCollapsed, (newValue) => {
  if (!hasTitle.value || !isCollapsible.value) {
    isInitiallyCollapsed.value = false;
    itemTableBlock.layout.initiallyCollapsed = false;
    return;
  }
  itemTableBlock.layout.initiallyCollapsed = newValue;
});
</script>

<i18n lang="json">
{
  "en": {
    "text-settings-label": "Text",
    "main-title-label": "Title",

    "item-table-section-label": "Item data",
    "elements-display-order": "Elements display and order",
    "layout-settings-label": "Layout settings",
    "padding-label": "Padding (px)",
    "spacing-around": "Spacing around the table",
    "display-as-collapsable": "Display as collapsable",
    "initially-collapsed": "Initially collapsed",

    "field-itemId": "Item ID",
    "field-condition": "Condition",
    "field-ageRating": "Age rating",
    "field-externalVariationId": "External variation ID",
    "field-model": "Model",
    "field-manufacturer": "Manufacturer",
    "field-manufacturingCountry": "Manufacturing country",
    "field-content": "Content",
    "field-grossWeight": "Gross weight",
    "field-netWeight": "Net weight",
    "field-dimensions": "Dimensions",
    "field-customTariffNumber": "Custom tariff number",
    "field-properties": "Properties",

    "drag-reorder-aria": "Drag to reorder"
  },
  "de": {
    "text-settings-label": "Text",
    "main-title-label": "Title",

    "item-table-section-label": "Item data",
    "elements-display-order": "Elements display and order",
    "layout-settings-label": "Layout settings",
    "padding-label": "Padding (px)",
    "spacing-around": "Spacing around the table",
    "display-as-collapsable": "Display as collapsable",
    "initially-collapsed": "Initially collapsed",

    "field-itemId": "Item ID",
    "field-condition": "Condition",
    "field-ageRating": "Age rating",
    "field-externalVariationId": "External variation ID",
    "field-model": "Model",
    "field-manufacturer": "Manufacturer",
    "field-manufacturingCountry": "Manufacturing country",
    "field-content": "Content",
    "field-grossWeight": "Gross weight",
    "field-netWeight": "Net weight",
    "field-dimensions": "Dimensions",
    "field-customTariffNumber": "Custom tariff number",
    "field-properties": "Properties",

    "drag-reorder-aria": "Drag to reorder"
  }
}
</i18n>
