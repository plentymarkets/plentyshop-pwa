<template>
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

            <SfSwitch
              v-model="itemTableBlock.fields[element]"
              :data-testid="`item-table-visible-${element}`"
            />
          </div>
        </template>
      </draggable>
    </div>
  </UiAccordionItem>

  <!-- ACCORDION: layout -->
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
      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
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
import { reactive, ref } from 'vue'
import draggable from 'vuedraggable'
import {
  SfSwitch,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfIconArrowBack,
} from '@storefront-ui/vue'
import dragIcon from 'assets/icons/paths/drag.svg'
import type {
  ItemDataContent,
  ItemDataFieldKey,
  ItemDataFieldLabels,
} from './types'

const route = useRoute();

const { data } = useCategoryTemplate(route?.meta?.identifier as string, route.meta.type as string);
console.log('data in itemdataform', data);

const { blockUuid } = useSiteConfiguration()
const { findOrDeleteBlockByUuid } = useBlockManager()

const props = defineProps<{
  uuid?: string
}>()

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
]

const raw = (findOrDeleteBlockByUuid(
  data.value,
  props.uuid || blockUuid.value
)?.content ?? {}) as Partial<ItemDataContent>

const itemTableBlock = reactive<ItemDataContent>({
  text: raw.text ?? { title: 'More details' },
  fields: {
    ...Object.fromEntries(ALL_KEYS.map((k) => [k, true])),
    ...(raw.fields ?? {}),
  },
  fieldsOrder: raw.fieldsOrder && raw.fieldsOrder.length ? raw.fieldsOrder : [...ALL_KEYS],
  layout: {
    paddingTop: raw.layout?.paddingTop ?? 0,
    paddingBottom: raw.layout?.paddingBottom ?? 0,
    paddingRight: raw.layout?.paddingRight ?? 0,
    paddingLeft: raw.layout?.paddingLeft ?? 0,
  },
})

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
}

const fieldsOpen = ref(true)
const layoutOpen = ref(false)
</script>

<i18n lang="json">
{
  "en": {
    "item-table-section-label": "Item data",
    "elements-display-order": "Elements display and order",
    "layout-settings-label": "Layout settings",
    "padding-label": "Padding (px)",
    "spacing-around": "Spacing around the table",

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
