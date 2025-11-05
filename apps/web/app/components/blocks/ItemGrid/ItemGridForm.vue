<template>
  <UiAccordionItem
    v-model="layoutOpen"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="item-grid-layout"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('layout-settings-label') }}</h2>
    </template>

    <div class="space-y-4">
      <div>
        <UiFormLabel class="flex justify-between">
          {{ getEditorTranslation('items-per-row-desktop') }}
          <SfTooltip :label="getEditorTranslation('items-per-row-desktop-tooltip')">
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </UiFormLabel>
        <select
          v-model.number="uiItemGridBlock.itemsPerRowDesktop"
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          data-testid="items-per-row-desktop"
        >
          <option v-for="n in desktopOptions" :key="'d-' + n" :value="n">{{ n }}</option>
        </select>
      </div>

      <div>
        <UiFormLabel>{{ getEditorTranslation('items-per-row-tablet') }}</UiFormLabel>
        <select
          v-model.number="uiItemGridBlock.itemsPerRowTablet"
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          data-testid="items-per-row-tablet"
        >
          <option v-for="n in tabletOptions" :key="'t-' + n" :value="n">{{ n }}</option>
        </select>
      </div>

      <div>
        <UiFormLabel>{{ getEditorTranslation('items-per-row-mobile') }}</UiFormLabel>
        <select
          v-model.number="uiItemGridBlock.itemsPerRowMobile"
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          data-testid="items-per-row-mobile"
        >
          <option v-for="n in mobileOptions" :key="'m-' + n" :value="n">{{ n }}</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <UiFormLabel>{{ getEditorTranslation('show-item-count') }}</UiFormLabel>
        <SfSwitch v-model="uiItemGridBlock.showItemCount" data-testid="show-item-count" />
      </div>

      <div v-if="uiItemGridBlock.showItemCount">
        <UiFormLabel>{{ getEditorTranslation('item-count-position') }}</UiFormLabel>
        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiItemGridBlock.itemCountPosition === 'left' }"
            data-testid="item-count-left"
            @click="uiItemGridBlock.itemCountPosition = 'left'"
          >
            <SfIconCheck :class="{ invisible: uiItemGridBlock.itemCountPosition !== 'left' }" class="w-[1.1rem] mr-1" />
            {{ getEditorTranslation('position-left') }}
          </div>
          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiItemGridBlock.itemCountPosition === 'center' }"
            data-testid="item-count-center"
            @click="uiItemGridBlock.itemCountPosition = 'center'"
          >
            <SfIconCheck
              :class="{ invisible: uiItemGridBlock.itemCountPosition !== 'center' }"
              class="w-[1.1rem] mr-1"
            />
            {{ getEditorTranslation('position-center') }}
          </div>
          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiItemGridBlock.itemCountPosition === 'right' }"
            data-testid="item-count-right"
            @click="uiItemGridBlock.itemCountPosition = 'right'"
          >
            <SfIconCheck
              :class="{ invisible: uiItemGridBlock.itemCountPosition !== 'right' }"
              class="w-[1.1rem] mr-1"
            />
            {{ getEditorTranslation('position-right') }}
          </div>
        </div>
      </div>
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="cardOpen"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="item-grid-card"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('item-card-label') }}</h2>
    </template>

    <div class="py-4">
      <draggable
        v-if="uiItemGridBlock.fieldsOrder.length"
        v-model="uiItemGridBlock.fieldsOrder"
        item-key="meta.uuid"
        handle=".drag-slides-handle"
        class="rounded"
        :filter="'.no-drag'"
      >
        <template #item="{ element: elem, index }: { element: ItemGridFieldKey; index: number }">
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
              v-model="uiItemGridBlock.fields[elem]"
              :disabled="uiItemGridBlock.fieldsDisabled?.includes(elem)"
              :data-testid="`item-grid-field-${elem}`"
            />
          </div>
        </template>
      </draggable>
    </div>

    <hr class="mb-6" />

    <div class="mb-6">
      <UiFormLabel>{{ getEditorTranslation('content-alignment') }}</UiFormLabel>
      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiItemGridBlock.contentAlignment === 'left' }"
          data-testid="content-align-left"
          @click="uiItemGridBlock.contentAlignment = 'left'"
        >
          <SfIconCheck :class="{ invisible: uiItemGridBlock.contentAlignment !== 'left' }" class="w-[1.1rem] mr-1" />
          {{ getEditorTranslation('position-left') }}
        </div>
        <div
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiItemGridBlock.contentAlignment === 'center' }"
          data-testid="content-align-center"
          @click="uiItemGridBlock.contentAlignment = 'center'"
        >
          <SfIconCheck :class="{ invisible: uiItemGridBlock.contentAlignment !== 'center' }" class="w-[1.1rem] mr-1" />
          {{ getEditorTranslation('position-center') }}
        </div>
        <div
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiItemGridBlock.contentAlignment === 'right' }"
          data-testid="content-align-right"
          @click="uiItemGridBlock.contentAlignment = 'right'"
        >
          <SfIconCheck :class="{ invisible: uiItemGridBlock.contentAlignment !== 'right' }" class="w-[1.1rem] mr-1" />
          {{ getEditorTranslation('position-right') }}
        </div>
      </div>
    </div>

    <div class="flex items-center justify-between mb-4">
      <UiFormLabel>{{ getEditorTranslation('card-borders') }}</UiFormLabel>
      <SfSwitch v-model="uiItemGridBlock.cardBorders" data-testid="card-borders" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <UiFormLabel>{{ getEditorTranslation('show-second-image') }}</UiFormLabel>
      <SfSwitch v-model="uiItemGridBlock.showSecondImageOnHover" data-testid="second-image-on-hover" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <UiFormLabel>{{ getEditorTranslation('show-wishlist-button') }}</UiFormLabel>
      <SfSwitch v-model="uiItemGridBlock.showWishlistButton" data-testid="show-wishlist-button" />
    </div>

    <div>
      <UiFormLabel>{{ getEditorTranslation('add-to-cart-button-style') }}</UiFormLabel>
      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiItemGridBlock.addToCartStyle === 'primary' }"
          data-testid="add-to-cart-primary"
          @click="uiItemGridBlock.addToCartStyle = 'primary'"
        >
          <SfIconCheck :class="{ invisible: uiItemGridBlock.addToCartStyle !== 'primary' }" class="w-[1.1rem] mr-1" />
          {{ getEditorTranslation('button-primary') }}
        </div>
        <div
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiItemGridBlock.addToCartStyle === 'secondary' }"
          data-testid="add-to-cart-secondary"
          @click="uiItemGridBlock.addToCartStyle = 'secondary'"
        >
          <SfIconCheck :class="{ invisible: uiItemGridBlock.addToCartStyle !== 'secondary' }" class="w-[1.1rem] mr-1" />
          {{ getEditorTranslation('button-secondary') }}
        </div>
      </div>
    </div>
  </UiAccordionItem>

  <UiAccordionItem
    v-model="paginationOpen"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="item-grid-pagination"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('pagination-label') }}</h2>
    </template>

    <div class="space-y-4">
      <div>
        <UiFormLabel>{{ getEditorTranslation('pagination-position') }}</UiFormLabel>
        <select
          v-model="uiItemGridBlock.paginationPosition"
          class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
          data-testid="pagination-position"
        >
          <option value="bottom">{{ getEditorTranslation('position-bottom') }}</option>
          <option value="top">{{ getEditorTranslation('position-top') }}</option>
          <option value="both">{{ getEditorTranslation('position-both') }}</option>
        </select>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfSwitch, SfIconCheck, SfTooltip, SfIconInfo } from '@storefront-ui/vue';
import type { ItemGridFormProps, ItemGridContent, ItemGridFieldKey } from './types';
import dragIcon from '~/assets/icons/paths/drag.svg';
import draggable from 'vuedraggable/src/vuedraggable';

const route = useRoute();
const { data } = useCategoryTemplate(route?.meta?.identifier as string, route.meta.type as string);

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const layoutOpen = ref(true);
const cardOpen = ref(true);
const paginationOpen = ref(true);

const props = defineProps<ItemGridFormProps>();

const uiItemGridBlock = computed(
  () => findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content as ItemGridContent,
);

const desktopOptions = [2, 3, 4, 5, 6, 7];
const tabletOptions = [2, 3, 4, 5, 6];
const mobileOptions = [1, 2];

const fieldLabels: Record<string, string> = {
  manufacturer: getEditorTranslation('field-manufacturer'),
  title: getEditorTranslation('field-item-title'),
  rating: getEditorTranslation('field-item-rating'),
  previewText: getEditorTranslation('field-preview-text'),
  shippingBadge: getEditorTranslation('field-shipping-badge'),
  price: getEditorTranslation('field-price'),
  addToCart: getEditorTranslation('field-add-to-cart'),
};
</script>

<i18n lang="json">
{
  "en": {
    "layout-settings-label": "Layout settings",
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
    "pagination-position": "Pagination position",
    "drag-reorder-aria": "Drag to reorder"
  },
  "de": {
    "layout-settings-label": "Layout settings",
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
    "drag-reorder-aria": "Drag to reorder",

    "pagination-label": "Pagination",
    "pagination-position": "Pagination position"
  }
}
</i18n>
