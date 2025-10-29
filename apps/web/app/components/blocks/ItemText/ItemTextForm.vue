<template>
  <div>
    <UiAccordionItem
      v-model="textSettings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="item-grid-layout"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('text-settings-label') }}</h2>
      </template>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>{{ getEditorTranslation('main-title-label') }}</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="itemTextBlock.title" type="text" data-testid="input-main-title">
            <template #suffix>
              <label for="text-title" class="rounded-lg cursor-pointer">
                <input id="text-title" v-model="itemTextBlock.title" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="layoutSettings"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="item-grid-layout"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('layout-settings-label') }}</h2>
      </template>

      <div class="flex justify-between my-5">
        <span>{{ getEditorTranslation('display-as-collapsable') }}</span>
        <span>
          <SfSwitch
            v-model="itemTextBlock.displayAsCollapsable"
            data-testid="item-text-displayAsCollapsable-switch"
          />
        </span>
      </div>

      <div class="flex justify-between">
        <span>{{ getEditorTranslation('initially-collapsed') }}</span>
        <span>
          <SfSwitch
            v-model="itemTextBlock.initiallyCollapsed"
            data-testid="item-text-initiallyCollapsed-switch"
          />
        </span>
      </div>
      
      <div class="mt-5">
        {{ getEditorTranslation('padding') }}
      </div>
      <div>
        <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="itemTextBlock.layout.paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
          />
        </div>

        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="itemTextBlock.layout.paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="itemTextBlock.layout.paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="itemTextBlock.layout.paddingRight"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-right"
          />
        </div>
      </div>
      </div>

    </UiAccordionItem>
    </div>
  </template>
  
  <script setup lang="ts">
  import {
    SfInput,
    SfTextarea,
    SfSwitch,
    SfIconCheck,
    SfIconArrowUpward,
    SfIconArrowDownward,
    SfIconArrowBack,
    SfIconArrowForward,
  } from '@storefront-ui/vue';
  import type { ItemTextFormProps, ItemTextContent } from './types';
  
  const { data } = useCategoryTemplate();
  const { blockUuid } = useSiteConfiguration();
  const { findOrDeleteBlockByUuid } = useBlockManager();
  
  const props = defineProps<ItemTextFormProps>();
  
  const itemTextBlock = computed<ItemTextContent>(() => {
    const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ?? {};
    const content = rawContent as Partial<ItemTextContent>;
    if (!content.title) content.title = '';
    return content as ItemTextContent;
  });
  
  const textSettings = ref(false);
  const layoutSettings = ref(false);

</script>
  
<i18n lang="json">
  {
    "en": {
      "text-settings-label": "Text",
      "main-title-label": "Title",
      "layout-settings-label": "Layout Settings",
      "display-as-collapsable": "Disaply as Collapsable",
      "initially-collapsed": "Initially Collpsed",
      "padding": "Padding",
      "items-per-row-desktop": "Items per row (Desktop)",
      "items-per-row-desktop-tooltip": "Set the number of products displayed per row. Recommended default values: Desktop 4, Tablet 3, Mobile 1 ",
      "items-per-row-tablet": "Items per row (Tablet)",
      "items-per-row-mobile": "Items per row (Mobile)",
      "show-item-count": "Show item count",
      "item-count-position": "Item count position",
      "position-left": "Left",
      "position-center": "Center",
      "position-right": "Right",
      "position-top": "Top",
      "position-bottom": "Bottom",
      "position-both": "Both",
      "position-none": "None",
      "item-card-label": "Item card",
      "field-manufacturer": "Manufacturer",
      "field-item-title": "Item title",
      "field-item-rating": "Item rating",
      "field-preview-text": "Preview text",
      "field-shipping-badge": "Shipping badge",
      "field-price": "Price",
      "field-add-to-cart": "“Add to cart” button",
      "content-alignment": "Content alignment",
      "card-borders": "Card borders",
      "show-second-image": "Show second image on hover",
      "show-wishlist-button": "Show wishlist button",
      "add-to-cart-button-style": "“Add to cart” button",
      "button-primary": "Primary",
      "button-secondary": "Secondary",
      "pagination-label": "Pagination",
      "pagination-position": "Pagination position"
    },
    "de": {
      "text-settings-label": "Text",
      "main-title-label": "Title",
      "layout-settings-label": "Layout Settings",
      "initially-collapsed": "Initially Collpsed",
      "padding": "Padding",
      "items-per-row-desktop": "Items per row (Desktop)",
      "items-per-row-tablet": "Items per row (Tablet)",
      "items-per-row-mobile": "Items per row (Mobile)",
      "show-item-count": "Show item count",
      "item-count-position": "Item count position",
      "position-left": "Left",
      "position-center": "Center",
      "position-right": "Right",
      "position-top": "Top",
      "position-bottom": "Bottom",
      "position-both": "Both",
      "position-none": "None",
      "item-card-label": "Item card",
      "field-manufacturer": "Manufacturer",
      "field-item-title": "Item title",
      "field-item-rating": "Item rating",
      "field-preview-text": "Preview text",
      "field-shipping-badge": "Shipping badge",
      "field-price": "Price",
      "field-add-to-cart": "“Add to cart” button",
      "content-alignment": "Content alignment",
      "card-borders": "Card borders",
      "show-second-image": "Show second image on hover",
      "show-wishlist-button": "Show wishlist button",
      "add-to-cart-button-style": "“Add to cart” button",
      "button-primary": "Primary",
      "button-secondary": "Secondary",
  
      "pagination-label": "Pagination",
      "pagination-position": "Pagination position"
    }
  }
  </i18n>
  