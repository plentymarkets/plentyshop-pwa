<template>
  <UiAccordionItem
    v-model="cardOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="price-card"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('card-section-label') }}</h2>
    </template>

    <div class="py-4">
      <UiFormLabel class="block mb-4">{{ getEditorTranslation('elements-display-order') }}</UiFormLabel>

      <draggable
        v-if="priceCardBlock.fieldsOrder.length"
        v-model="priceCardBlock.fieldsOrder"
        item-key="field"
        handle=".drag-slides-handle"
        class="rounded space-y-3"
        :filter="'.no-drag'"
      >
        <template #item="{ element: fieldKey, index }: { element: PriceCardFieldKey; index: number }">
          <div
            :key="fieldKey"
            class="flex items-center justify-between drag-slides-handle cursor-move"
            :data-testid="`price-card-field-${fieldKey}`"
          >
            <div class="flex items-center gap-3">
              <button
                class="drag-slides-handle cursor-grab p-2 hover:bg-gray-100 rounded-full"
                :aria-label="getEditorTranslation('drag-reorder-aria')"
                :data-testid="`actions-drag-field-handle-${index}`"
              >
                <NuxtImg width="18" height="18" :src="dragIcon" />
              </button>

              <span>{{ fieldLabels[fieldKey] }}</span>

              <template v-if="fieldKey === 'itemBundle'">
                <SfTooltip class="leading-none" :label="getEditorTranslation('item-bundle-tooltip')" placement="top">
                  <SfIconInfo size="sm" />
                </SfTooltip>
              </template>
            </div>

            <SfSwitch
              v-model="priceCardBlock.fields[fieldKey]"
              :disabled="priceCardBlock.fieldsDisabled?.includes(fieldKey)"
              :data-testid="`price-card-visible-${fieldKey}`"
            />
          </div>
        </template>
      </draggable>
    </div>

    <hr class="my-4" />

    <div class="py-4">
      <UiFormLabel class="block mb-2">{{ getEditorTranslation('wishlist-size-label') }}</UiFormLabel>

      <div
        class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
        data-testid="wishlist-size-toggle"
      >
        <div
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{
            'bg-gray-100 text-gray-900 font-semibold': priceCardBlock.wishlistSize === 'small',
          }"
          data-testid="wishlist-size-small"
          @click="priceCardBlock.wishlistSize = 'small'"
        >
          <SfIconCheck :class="{ invisible: priceCardBlock.wishlistSize !== 'small' }" class="mr-1 w-[1.1rem]" />
          {{ getEditorTranslation('wishlist-size-small') }}
        </div>

        <div
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{
            'bg-gray-100 text-gray-900 font-semibold': priceCardBlock.wishlistSize === 'large',
          }"
          data-testid="wishlist-size-large"
          @click="priceCardBlock.wishlistSize = 'large'"
        >
          <SfIconCheck :class="{ invisible: priceCardBlock.wishlistSize !== 'large' }" class="mr-1 w-[1.1rem]" />
          {{ getEditorTranslation('wishlist-size-large') }}
        </div>
      </div>
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="layoutOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="price-card-layout"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('layout-settings-label') }}</h2>
    </template>

    <div class="flex items-center justify-between py-4">
      <UiFormLabel>{{ getEditorTranslation('drop-shadow-label') }}</UiFormLabel>
      <SfSwitch v-model="priceCardBlock.dropShadow" data-testid="price-card-drop-shadow" />
    </div>

    <div class="flex items-center justify-between py-4">
      <UiFormLabel>{{ getEditorTranslation('borders-label') }}</UiFormLabel>
      <SfSwitch v-model="priceCardBlock.borders" data-testid="price-card-borders" />
    </div>

    <div class="py-4">
      <UiFormLabel class="mb-2 block">{{ getEditorTranslation('border-color-label') }}</UiFormLabel>

      <SfInput v-model="priceCardBlock.borderColor" type="text" data-testid="price-card-border-color">
        <template #suffix>
          <label
            for="border-color"
            :style="{ backgroundColor: priceCardBlock.borderColor }"
            class="border border-[#a0a0a0] rounded-lg cursor-pointer"
          >
            <input id="border-color" v-model="priceCardBlock.borderColor" type="color" class="invisible w-8" />
          </label>
        </template>
      </SfInput>
    </div>

    <div class="py-2">
      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="priceCardBlock.layout.paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="priceCardBlock.layout.paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="priceCardBlock.layout.paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="priceCardBlock.layout.paddingRight"
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
  SfSwitch,
  SfInput,
  SfIconCheck,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfIconArrowBack,
  SfIconInfo,
  SfTooltip,
} from '@storefront-ui/vue';
import dragIcon from 'assets/icons/paths/drag.svg';
import type { PriceCardFieldKey, PriceCardContent } from '~/components/ui/PurchaseCard/types';
import type { PriceCardFormProps } from '~/components/blocks/PriceCard/types';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<PriceCardFormProps>();

const priceCardBlock = computed<PriceCardContent>(() => {
  const block = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value);
  return block?.content as PriceCardContent;
});

const { getSetting } = useSiteSettings('dontSplitItemBundle');
priceCardBlock.value.fields['itemBundle'] = getSetting() !== '1';

const fieldLabels = {
  itemName: getEditorTranslation('field-itemName'),
  price: getEditorTranslation('field-price'),
  tags: getEditorTranslation('field-tags'),
  availability: getEditorTranslation('field-availability'),
  starRating: getEditorTranslation('field-starRating'),
  variationProperties: getEditorTranslation('variation-properties'),
  orderProperties: getEditorTranslation('order-properties'),
  previewText: getEditorTranslation('field-previewText'),
  attributes: getEditorTranslation('field-attributes'),
  itemBundle: getEditorTranslation('field-itemBundle'),
  graduatedPrices: getEditorTranslation('field-graduatedPrices'),
  addToWishlist: getEditorTranslation('field-addToWishlist'),
  quantityAndAddToCart: getEditorTranslation('field-quantityAndAddToCart'),
  itemText: getEditorTranslation('field-itemText'),
  technicalData: getEditorTranslation('field-technicalData'),
};

const cardOpen = ref(true);
const layoutOpen = ref(false);
</script>

<i18n lang="json">
{
  "en": {
    "card-section-label": "Card",
    "elements-display-order": "Elements display and order",
    "wishlist-size-label": "\"Add to wishlist\" size",
    "wishlist-size-small": "Small",
    "wishlist-size-large": "Large",

    "layout-settings-label": "Layout settings",
    "drop-shadow-label": "Drop shadow",
    "borders-label": "Borders",
    "border-color-label": "Border color",
    "padding-label": "Padding (px)",

    "field-itemName": "Item name",
    "field-price": "Price",
    "field-tags": "Tags",
    "field-availability": "Availability",
    "field-starRating": "Star rating",
    "variation-properties": "Variation properties",
    "order-properties": "Order properties",
    "field-previewText": "Preview text",
    "field-attributes": "Attributes",
    "field-itemBundle": "Item bundle",
    "field-graduatedPrices": "Graduated prices",
    "field-addToWishlist": "Add to wishlist",
    "field-quantityAndAddToCart": "Quantity and add to cart",
    "field-itemText": "Item text",
    "field-technicalData": "Technical data",

    "texts-label": "Texts",
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",

    "main-title-label": "Main Title",
    "main-title-placeholder": "Title",

    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "Subtitle",

    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",

    "text-color-label": "Text colour",

    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "drag-reorder-aria": "Drag to reorder",
    "item-bundle-tooltip": "Bundle components are controlled globally. To show the bundle components, change the bundle setting under Item > Item Bundles"
  },
  "de": {
    "card-section-label": "Card",
    "elements-display-order": "Elements display and order",
    "wishlist-size-label": "\"Add to wishlist\" size",
    "wishlist-size-small": "Small",
    "wishlist-size-large": "Large",

    "layout-settings-label": "Layout settings",
    "drop-shadow-label": "Drop shadow",
    "borders-label": "Borders",
    "border-color-label": "Border color",
    "padding-label": "Padding (px)",

    "field-itemName": "Item name",
    "field-price": "Price",
    "field-tags": "Tags",
    "field-availability": "Availability",
    "field-starRating": "Star rating",
    "variation-properties": "Variation properties",
    "order-properties": "Order properties",
    "field-previewText": "Preview text",
    "field-attributes": "Attributes",
    "field-itemBundle": "Item bundle",
    "field-graduatedPrices": "Graduated prices",
    "field-addToWishlist": "Add to wishlist",
    "field-quantityAndAddToCart": "Quantity and add to cart",
    "field-itemText": "Item text",
    "field-technicalData": "Technical data",

    "texts-label": "Texts",
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",

    "main-title-label": "Main Title",
    "main-title-placeholder": "Title",

    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "Subtitle",

    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",

    "text-color-label": "Text colour",

    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "drag-reorder-aria": "Drag to reorder",
    "item-bundle-tooltip": "Bundle components are controlled globally. To show the bundle components, change the bundle setting under Item > Item Bundles"
  }
}
</i18n>
