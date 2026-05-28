<template>
  <UiAccordionItem
    v-model="cardOpen"
    data-testid="price-card"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('card-section-label') }}</h2>
    </template>

    <div class="py-4">
      <UiFormLabel class="block mb-4">{{ getEditorTranslation('elements-display-order') }}</UiFormLabel>

      <draggable
        v-if="priceCardBlock.fieldsOrder.length"
        v-model="priceCardBlock.fieldsOrder"
        :filter="'.no-drag'"
        class="rounded space-y-3"
        handle=".drag-slides-handle"
        item-key="field"
      >
        <template #item="{ element: fieldKey, index }: { element: PriceCardFieldKey; index: number }">
          <div
            :key="fieldKey"
            :data-testid="`price-card-field-${fieldKey}`"
            class="flex items-center justify-between drag-slides-handle cursor-move"
          >
            <div class="flex items-center gap-3">
              <button
                :aria-label="getEditorTranslation('drag-reorder-aria')"
                :data-testid="`actions-drag-field-handle-${index}`"
                class="drag-slides-handle cursor-grab p-2 hover:bg-gray-100 rounded-full"
              >
                <NuxtImg :src="dragIcon" height="18" width="18" />
              </button>

              <span>{{ fieldLabels[fieldKey] }}</span>

              <template v-if="fieldKey === 'itemBundle'">
                <SfTooltip :label="getEditorTranslation('item-bundle-tooltip')" class="leading-none" placement="top">
                  <SfIconInfo size="sm" />
                </SfTooltip>
              </template>
            </div>

            <SfSwitch
              v-model="priceCardBlock.fields[fieldKey]"
              :data-testid="`price-card-visible-${fieldKey}`"
              :disabled="priceCardBlock.fieldsDisabled?.includes(fieldKey)"
            />
          </div>
        </template>
      </draggable>
    </div>

    <hr class="my-4" />

    <div class="py-4">
      <EditorOptionsTabs
        v-model="wishlistSizeModel"
        :legend="getEditorTranslation('wishlist-size-label')"
        :options="wishlistSizeOptions"
        test-id-prefix="wishlist-size"
      />
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="layoutOpen"
    data-testid="price-card-layout"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
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
    <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
    <div class="py-4">
      <UiFormLabel class="mb-2 block">{{ getEditorTranslation('border-color-label') }}</UiFormLabel>
      <EditorColorPicker v-model="priceCardBlock.borderColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <SfInput v-model="priceCardBlock.borderColor" data-testid="price-card-border-color" type="text">
            <template #suffix>
              <button
                :style="{ backgroundColor: color }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                type="button"
                @mousedown.stop
                @click.stop="toggle"
              />
            </template>
          </SfInput>
        </template>
      </EditorColorPicker>
    </div>
    <div class="py-2">
      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="priceCardBlock.layout.paddingTop"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
            type="number"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="priceCardBlock.layout.paddingBottom"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
            type="number"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="priceCardBlock.layout.paddingLeft"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
            type="number"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="priceCardBlock.layout.paddingRight"
            class="w-12 text-center outline-none"
            data-testid="padding-right"
            type="number"
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

<script lang="ts" setup>
import draggable from 'vuedraggable';
import {
  SfSwitch,
  SfInput,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfIconArrowBack,
  SfIconInfo,
  SfTooltip,
} from '@storefront-ui/vue';
import dragIcon from '~/assets/icons/paths/drag.svg';
import type { PriceCardFieldKey, PriceCardContent } from '~/components/ui/PurchaseCard/types';
import type { PriceCardFormProps } from '~/components/blocks/PriceCard/types';

const { allBlocks: data } = useBlocks();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<PriceCardFormProps>();

const priceCardBlock = computed<PriceCardContent>(() => {
  const block = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value);
  return block?.content as PriceCardContent;
});

const { isFullWidth } = useFullWidthToggleForContent(priceCardBlock);

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

const { wishlistSizeModel, wishlistSizeOptions } = useEditorOptionsTabs(
  () => priceCardBlock.value,
  getEditorTranslation,
);
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
