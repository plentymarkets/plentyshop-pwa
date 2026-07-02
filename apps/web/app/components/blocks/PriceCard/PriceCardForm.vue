<template>
  <EditorFormPanel v-model="cardOpen" :title="getEditorTranslation('card-section-label')" data-testid="price-card">
    <div class="py-4">
      <UiFormLabel class="block mb-4">{{ getEditorTranslation('elements-display-order') }}</UiFormLabel>

      <draggable
        v-if="priceCardBlock.fieldsOrder.length"
        v-model="priceCardBlock.fieldsOrder"
        :filter="'.no-drag'"
        :item-key="getItemKey"
        class="rounded space-y-3"
        handle=".drag-slides-handle"
      >
        <template #item="{ element: fieldKey, index }: { element: PriceCardOrderItem; index: number }">
          <div :key="getFieldKey(fieldKey)">
            <div
              :data-testid="`price-card-field-${isTextBlock(fieldKey) ? fieldKey.uuid : fieldKey}`"
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

                <span v-if="isTextBlock(fieldKey)">{{ getEditorTranslation('field-textBlock') }}</span>
                <span v-else>{{ fieldLabels[fieldKey as PriceCardFieldKey] }}</span>

                <template v-if="!isTextBlock(fieldKey) && fieldKey === 'itemBundle'">
                  <SfTooltip :label="getEditorTranslation('item-bundle-tooltip')" class="leading-none" placement="top">
                    <SfIconInfo size="sm" />
                  </SfTooltip>
                </template>
              </div>

              <div class="flex items-center gap-1 no-drag">
                <template v-if="isTextBlock(fieldKey)">
                  <button
                    :aria-label="getEditorTranslation('edit-text-block-aria')"
                    :data-testid="`price-card-edit-textblock-${fieldKey.uuid}`"
                    class="p-1 hover:bg-gray-100 rounded-full"
                    type="button"
                    @click.stop="onEditTextBlock(fieldKey)"
                  >
                    <SfIconBase size="xs" viewBox="0 0 18 18">
                      <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
                        <path :d="editPath" fill="currentColor" />
                      </svg>
                    </SfIconBase>
                  </button>
                  <button
                    :aria-label="getEditorTranslation('delete-text-block-aria')"
                    :data-testid="`price-card-delete-textblock-${fieldKey.uuid}`"
                    class="p-1 hover:bg-gray-100 rounded-full"
                    type="button"
                    @click.stop="removeTextBlock(fieldKey)"
                  >
                    <SfIconDelete height="18" size="sm" />
                  </button>
                  <SfSwitch
                    :data-testid="`price-card-visible-textblock-${fieldKey.uuid}`"
                    :model-value="fieldKey.visible"
                    @update:model-value="updateTextBlockVisible(fieldKey, !!$event)"
                  />
                </template>
                <template v-else>
                  <SfSwitch
                    v-model="priceCardBlock.fields[fieldKey as PriceCardFieldKey]"
                    :data-testid="`price-card-visible-${fieldKey}`"
                    :disabled="priceCardBlock.fieldsDisabled?.includes(fieldKey as PriceCardFieldKey)"
                  />
                </template>
              </div>
            </div>

            <div v-if="isTextBlock(fieldKey) && openRteUuid === fieldKey.uuid" class="mt-2 no-drag" @click.stop>
              <EditorRichTextEditorForm
                :model-value="fieldKey.content"
                @update:model-value="updateTextBlockContent(fieldKey, $event)"
              />
            </div>
          </div>
        </template>
      </draggable>

      <div class="px-0 py-2.5">
        <button
          class="w-full py-1.5 rounded-md border border-editor-accent/40 flex items-center justify-center gap-1.5 text-xs text-editor-accent hover:bg-editor-accent/[4%] transition-colors"
          data-testid="actions-add-text-block-button"
          type="button"
          @click="addTextBlock"
        >
          <SfIconAdd size="xs" />
          {{ getEditorTranslation('add-element') }}
        </button>
      </div>
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
  </EditorFormPanel>

  <EditorFormPanel
    v-model="layoutOpen"
    :title="getEditorTranslation('layout-settings-label')"
    data-testid="price-card-layout"
  >
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
  </EditorFormPanel>
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
  SfIconAdd,
  SfIconBase,
  SfIconDelete,
} from '@storefront-ui/vue';
import { v4 as uuidv4 } from 'uuid';
import dragIcon from '~/assets/icons/paths/drag.svg';
import { editPath } from '~/assets/icons/paths/edit';
import type {
  PriceCardFieldKey,
  PriceCardContent,
  PriceCardTextBlockItem,
  PriceCardOrderItem,
} from '~/components/ui/PurchaseCard/types';
import type { PriceCardFormProps } from '~/components/blocks/PriceCard/types';

const { allBlocks: data } = useBlocks();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { scrollToBlock } = useTableOfContents();

const props = defineProps<PriceCardFormProps>();

const priceCardBlock = computed<PriceCardContent>(() => {
  const block = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value);
  return block?.content as PriceCardContent;
});

const { isFullWidth } = useFullWidthToggleForContent(priceCardBlock);

const { getSetting } = useSiteSettings('dontSplitItemBundle');
priceCardBlock.value.fields['itemBundle'] = getSetting() !== '1';

const fieldLabels: Record<PriceCardFieldKey, string> = {
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

const isTextBlock = (item: PriceCardOrderItem): item is PriceCardTextBlockItem =>
  typeof item === 'object' && item !== null && (item as PriceCardTextBlockItem).type === 'textBlock';

const openRteUuid = ref<string | null>(null);

const addTextBlock = () => {
  const newBlock: PriceCardTextBlockItem = {
    type: 'textBlock',
    uuid: uuidv4(),
    content: '',
    visible: true,
  };
  priceCardBlock.value.fieldsOrder.push(newBlock);
};
const getItemKey = (item: PriceCardOrderItem): string => {
  return isTextBlock(item) ? item.uuid : item;
};

const getFieldKey = (fieldKey: PriceCardOrderItem): string => {
  return isTextBlock(fieldKey) ? fieldKey.uuid : fieldKey;
};
const removeTextBlock = (item: PriceCardTextBlockItem) => {
  const idx = priceCardBlock.value.fieldsOrder.indexOf(item);
  if (idx !== -1) priceCardBlock.value.fieldsOrder.splice(idx, 1);
  if (openRteUuid.value === item.uuid) openRteUuid.value = null;
};

const updateTextBlockContent = (item: PriceCardTextBlockItem, content: string) => {
  const textBlock = priceCardBlock.value.fieldsOrder.find(
    (field): field is PriceCardTextBlockItem => isTextBlock(field) && field.uuid === item.uuid,
  );
  if (textBlock) textBlock.content = content;
};

const updateTextBlockVisible = (item: PriceCardTextBlockItem, visible: boolean) => {
  const textBlock = priceCardBlock.value.fieldsOrder.find(
    (field): field is PriceCardTextBlockItem => isTextBlock(field) && field.uuid === item.uuid,
  );
  if (textBlock) textBlock.visible = visible;
};

const onEditTextBlock = (item: PriceCardTextBlockItem) => {
  openRteUuid.value = openRteUuid.value === item.uuid ? null : item.uuid;
  scrollToBlock(item.uuid);
};

const cardOpen = ref(true);
const layoutOpen = ref(true);

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
    "item-bundle-tooltip": "Bundle components are controlled globally. To show the bundle components, change the bundle setting under Item > Item Bundles",
    "add-element": "Add text and item data",
    "field-textBlock": "Rich text",
    "edit-text-block-aria": "Edit rich text",
    "delete-text-block-aria": "Delete rich text"
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
    "item-bundle-tooltip": "Bundle components are controlled globally. To show the bundle components, change the bundle setting under Item > Item Bundles",
    "add-element": "Add text and item data",
    "field-textBlock": "Rich text",
    "edit-text-block-aria": "Edit rich text",
    "delete-text-block-aria": "Delete rich text"
  }
}
</i18n>
