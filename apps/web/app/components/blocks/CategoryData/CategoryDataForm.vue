<template>
  <div>
    <UiAccordionItem
      v-model="textOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="item-grid-card"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('item-card-label') }}</h2>
      </template>

      <div class="py-2">
        <div class="flex items-center justify-between px-2 pb-2 text-sm font-medium text-gray-700">
          <span>{{ getEditorTranslation('item-card-text') }}</span>
          <SfTooltip :label="getEditorTranslation('item-card-tooltip')" placement="top">
            <SfIconInfo size="base" class="ml-2 text-gray-500" />
          </SfTooltip>
        </div>
        <draggable
          v-if="categoryDataBlock.fieldsOrder.length"
          v-model="categoryDataBlock.fieldsOrder"
          item-key="meta.uuid"
          handle=".drag-slides-handle"
          class="rounded"
          :filter="'.no-drag'"
        >
          <template #item="{ element: elem, index }: { element: CategoryDataFieldKey; index: number }">
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
                v-model="categoryDataBlock.fields[elem]"
                :disabled="categoryDataBlock.fieldsDisabled?.includes(elem)"
                :data-testid="`item-grid-field-${elem}`"
              />
            </div>
          </template>
        </draggable>
        <div
          v-if="showTextHint"
          class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600"
          role="alert"
          aria-live="polite"
          data-testid="fields-empty-hint"
        >
          <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" aria-hidden="true" />
          <span class="italic">
            {{ fieldsEmptyHintText }}
            (
            <a :href="learnMoreTextUrl" target="_blank" rel="noopener noreferrer" class="underline">
              {{ t('learn-more') }}
            </a>
            ).
          </span>
        </div>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="imageOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="category-data-image"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('image-label') }}</h2>
      </template>

      <div class="py-2">
        <UiFormLabel>{{ getEditorTranslation('display-category-image-label') }}</UiFormLabel>
        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.displayCategoryImage === 'off' }"
            data-testid="content-align-left"
            @click="categoryDataBlock.displayCategoryImage = 'off'"
          >
            <SfIconCheck
              :class="{ invisible: categoryDataBlock.displayCategoryImage !== 'off' }"
              class="w-[1.1rem] mr-1"
            />
            {{ getEditorTranslation('off') }}
          </div>
          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.displayCategoryImage === 'image-1' }"
            data-testid="content-align-center"
            @click="categoryDataBlock.displayCategoryImage = 'image-1'"
          >
            <SfIconCheck
              :class="{ invisible: categoryDataBlock.displayCategoryImage !== 'image-1' }"
              class="w-[1.1rem] mr-1"
            />
            {{ getEditorTranslation('image-1') }}
          </div>
          <div
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.displayCategoryImage === 'image-2' }"
            data-testid="content-align-right"
            @click="categoryDataBlock.displayCategoryImage = 'image-2'"
          >
            <SfIconCheck
              :class="{ invisible: categoryDataBlock.displayCategoryImage !== 'image-2' }"
              class="w-[1.1rem] mr-1"
            />
            {{ getEditorTranslation('image-2') }}
          </div>
        </div>
      </div>
      <div
        v-if="showImageSlotHint"
        class="mx-4 mt-4 mb-4 flex items-start gap-2 text-sm text-neutral-600"
        role="alert"
        aria-live="polite"
        data-testid="image-slot-empty-hint"
      >
        <SfIconWarning class="mt-0.5 shrink-0 text-yellow-500" aria-hidden="true" />
        <span class="italic">
          {{ t('image-slot-empty-hint-prefix') }}
          <a :href="learnMoreUrl" target="_blank" rel="noopener noreferrer" class="underline"> {{ t('learn-more') }} </a
          >.
        </span>
      </div>
      <div v-if="categoryDataBlock.displayCategoryImage !== 'off'" class="py-2">
        <div class="flex items-center gap-2">
          <legend class="text-sm font-medium text-black m-0">
            {{ getEditorTranslation('image-scalling-label') }}
          </legend>
          <SfTooltip :label="getEditorTranslation('image-scalling-tooltip')" placement="top">
            <SfIconInfo size="sm" />
          </SfTooltip>
        </div>
        <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden mt-2">
          <div
            data-testid="align-y-center"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.image.fillMode === 'fill' }"
            @click="categoryDataBlock.image.fillMode = 'fill'"
          >
            <SfIconCheck
              :class="{ invisible: categoryDataBlock.image.fillMode !== 'fill' }"
              class="w-[1.1rem] shrink-0 mr-1"
            />
            {{ getEditorTranslation('image-scalling-fill-label') }}
          </div>

          <div
            data-testid="align-y-top"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.image.fillMode === 'fit' }"
            @click="categoryDataBlock.image.fillMode = 'fit'"
          >
            <SfIconCheck
              :class="{ invisible: categoryDataBlock.image.fillMode !== 'fit' }"
              class="w-[1.1rem] shrink-0 mr-1"
            />
            {{ getEditorTranslation('image-scalling-fit-label') }}
          </div>
        </div>
      </div>

      <div v-if="categoryDataBlock.displayCategoryImage !== 'off'" class="py-2">
        <label class="block text-sm font-medium mb-4">{{ getEditorTranslation('image-brightness-label') }}</label>
        <div class="flex items-center gap-4">
          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
            <input
              v-model.number="categoryDataBlock.image.brightness"
              type="range"
              min="0"
              max="1"
              step="0.01"
              class="w-full"
            />
          </div>

          <div class="relative">
            <input
              v-model.number="categoryDataBlock.image.brightness"
              type="number"
              min="0"
              max="1"
              class="w-20 px-2 py-1 border rounded text-color-red-500"
              @input="clampBrightness($event, 'image')"
            />
          </div>
        </div>
      </div>

      <div v-if="categoryDataBlock.displayCategoryImage !== 'off'" class="py-2">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('image-alt-label') }}</UiFormLabel>
        <SfInput v-model="categoryDataBlock.image.alt" name="alt" type="text" data-testid="slide-alt-text" />
        <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
          {{ getEditorTranslation('image-alt-hint') }}
        </div>
      </div>

      <div class="py-2">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('text-color-label') }}</UiFormLabel>

        <SfInput v-model="categoryDataBlock.text.color" type="text">
          <template #suffix>
            <label
              for="category-text-color"
              :style="{ backgroundColor: categoryDataBlock.text.color }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input
                id="category-text-color"
                v-model="categoryDataBlock.text.color"
                type="color"
                class="invisible w-8"
              />
            </label>
          </template>
        </SfInput>
      </div>

      <div v-if="categoryDataBlock.displayCategoryImage !== 'off'" class="py-2">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-background-label') }}</UiFormLabel>
        <SfSwitch
          v-model="categoryDataBlock.text.background"
          class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
        />
      </div>

      <div v-if="categoryDataBlock.text.background" class="py-2">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-color-label') }}</UiFormLabel>

        <SfInput v-model="categoryDataBlock.text.bgColor" type="text">
          <template #suffix>
            <label
              for="text-bg-color"
              :style="{ backgroundColor: categoryDataBlock.text.bgColor }"
              class="border border-[#a0a0a0] rounded-lg cursor-pointer"
            >
              <input id="text-bg-color" v-model="categoryDataBlock.text.bgColor" type="color" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </div>

      <div v-if="categoryDataBlock.text.background && categoryDataBlock.displayCategoryImage !== 'off'" class="py-2">
        <label class="block text-sm font-medium mb-4">{{ getEditorTranslation('textbox-opacity-label') }}</label>
        <div class="flex items-center gap-4">
          <div class="flex-1 space-y-1">
            <div class="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>100%</span>
            </div>
            <input
              v-model.number="categoryDataBlock.text.bgOpacity"
              type="range"
              min="0"
              max="1"
              step="0.01"
              class="w-full"
            />
          </div>

          <div class="relative">
            <input
              v-model.number="categoryDataBlock.text.bgOpacity"
              type="number"
              min="0"
              max="1"
              class="w-20 px-2 py-1 border rounded text-color-red-500"
              @input="clampBrightness($event, 'text')"
            />
          </div>
        </div>
      </div>

      <div v-if="categoryDataBlock.displayCategoryImage !== 'off'" class="py-2">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-align-x-label') }}</UiFormLabel>

        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            for="textbox-align-left"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.align === 'left',
            }"
            data-testid="slider-textbox-y-align-left"
            @click="categoryDataBlock.text.align = 'left'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: categoryDataBlock.text.align !== 'left' }" />
            {{ getEditorTranslation('textbox-align-x-left-label') }}
          </div>

          <div
            for="textbox-align-center"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.align === 'center',
            }"
            data-testid="slider-textbox-y-align-center"
            @click="categoryDataBlock.text.align = 'center'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: categoryDataBlock.text.align !== 'center' }" />
            {{ getEditorTranslation('textbox-align-x-center-label') }}
          </div>

          <div
            for="textbox-align-right"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.align === 'right',
            }"
            data-testid="slider-textbox-y-align-right"
            @click="categoryDataBlock.text.align = 'right'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: categoryDataBlock.text.align !== 'right' }" />
            {{ getEditorTranslation('textbox-align-x-right-label') }}
          </div>
        </div>
      </div>

      <div v-if="categoryDataBlock.displayCategoryImage !== 'off'" class="py-2">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-align-y-label') }}</UiFormLabel>

        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            for="align-top"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.justify === 'top',
            }"
            data-testid="slider-textbox-align-top"
            @click="categoryDataBlock.text.justify = 'top'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: categoryDataBlock.text.justify !== 'top' }" />
            {{ getEditorTranslation('textbox-align-y-top-label') }}
          </div>

          <div
            for="align-center"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.justify === 'center',
            }"
            data-testid="slider-textbox-align-center"
            @click="categoryDataBlock.text.justify = 'center'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: categoryDataBlock.text.justify !== 'center' }" />
            {{ getEditorTranslation('textbox-align-y-center-label') }}
          </div>

          <div
            for="align-bottom"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.justify === 'bottom',
            }"
            data-testid="slider-textbox-align-bottom"
            @click="categoryDataBlock.text.justify = 'bottom'"
          >
            <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: categoryDataBlock.text.justify !== 'bottom' }" />
            {{ getEditorTranslation('textbox-align-y-bottom-label') }}
          </div>
        </div>
      </div>

      <div v-if="categoryDataBlock.displayCategoryImage !== 'off'" class="py-2">
        <UiFormLabel class="mb-1">{{ getEditorTranslation('text-align-label') }}</UiFormLabel>
        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            for="text-align-left"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.textAlignment === 'left',
            }"
            data-testid="slider-text-align-left"
            @click="categoryDataBlock.text.textAlignment = 'left'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: categoryDataBlock.text.textAlignment !== 'left' }"
            />
            {{ getEditorTranslation('text-align-option-left-label') }}
          </div>

          <div
            for="text-align-center"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.textAlignment === 'center',
            }"
            data-testid="slider-text-align-center"
            @click="categoryDataBlock.text.textAlignment = 'center'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: categoryDataBlock.text.textAlignment !== 'center' }"
            />
            {{ getEditorTranslation('text-align-option-center-label') }}
          </div>

          <div
            for="text-align-right"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{
              'bg-gray-100 text-gray-900 font-semibold': categoryDataBlock.text.textAlignment === 'right',
            }"
            data-testid="slider-text-align-right"
            @click="categoryDataBlock.text.textAlignment = 'right'"
          >
            <SfIconCheck
              class="mr-1 w-[1.1rem]"
              :class="{ invisible: categoryDataBlock.text.textAlignment !== 'right' }"
            />
            {{ getEditorTranslation('text-align-option-right-label') }}
          </div>
        </div>
      </div>
    </UiAccordionItem>
    <UiAccordionItem
      v-model="layoutOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="item-grid-card"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('layout-label') }}</h2>
      </template>

      <div
        class="py-2"
        :class="
          categoryDataBlock.image.fillMode !== 'fit' && categoryDataBlock.displayCategoryImage !== 'off'
            ? 'opacity-60  cursor-not-allowed'
            : ''
        "
      >
        <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
        <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowUpward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingTop"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-top"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowDownward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingBottom"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-bottom"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
            <span><SfIconArrowBack /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingLeft"
              type="number"
              class="w-12 text-center outline-none"
              data-testid="padding-left"
            />
          </div>
          <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
            <span><SfIconArrowForward /></span>
            <input
              v-model.number="categoryDataBlock.layout.paddingRight"
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
  </div>
</template>

<script setup lang="ts">
import type { CategoryDataFieldKey } from './types';
import {
  SfIconArrowBack,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfIconArrowUpward,
  SfSwitch,
  SfIconCheck,
  SfInput,
  SfTooltip,
  SfIconInfo,
  SfIconWarning,
} from '@storefront-ui/vue';
import dragIcon from '~/assets/icons/paths/drag.svg';
import draggable from 'vuedraggable/src/vuedraggable';

const layoutOpen = ref(true);
const textOpen = ref(true);
const imageOpen = ref(true);
const { t } = useI18n();

const {
  learnMoreUrl,
  learnMoreTextUrl,
  categoryDataBlock,
  fieldLabels,
  showImageSlotHint,
  showTextHint,
  fieldsEmptyHintText,
  clampBrightness,
} = useCategoryData();
</script>

<i18n lang="json">
{
  "en": {
    "layout-label": "Layout",

    "item-card-label": "Category text",
    "item-card-text": "Text display and order",
    "item-card-tooltip": "You can manage the description texts in the backend under Images/Categories.",
    "category-placeholder": "Category name",
    "category-name": "Category name",
    "category-description-1": "Category description 1",
    "category-description-2": "Category description 2",
    "short-description": "Short description",
    "drag-reorder-aria": "Drag to reorder",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements",

    "image-label": "Image",
    "display-category-image-label": "Display category image",
    "off": "Off",
    "image-1": "Image 1",
    "image-2": "Image 2",

    "image-scalling-label": "Image Scaling",
    "image-scalling-tooltip": "Fit: The image maintains its original aspect ratio and fits inside the available space, allowing padding. Fill: The image completely fills the available space, potentially cropping parts of the image, and ignores padding.",
    "image-scalling-fit-label": "Fit",
    "image-scalling-fill-label": "Fill",

    "image-brightness-label": "Brightness",
    "image-alt-label": "Alt",
    "image-alt-hint": "Alternative image text",

    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",
    "main-title-label": "Main title",
    "main-title-placeholder": "Title",
    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "SubTitle",
    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",

    "text-color-label": "Text Colour",
    "textbox-background-label": "Textbox Background",
    "textbox-color-label": "Textbox Colour",
    "textbox-opacity-label": "Textbox Opacity",

    "textbox-align-x-label": "Textbox Alignment (x)",
    "textbox-align-x-left-label": "Left",
    "textbox-align-x-center-label": "Center",
    "textbox-align-x-right-label": "Right",

    "textbox-align-y-label": "Textbox Alignment (y)",
    "textbox-align-y-top-label": "Top",
    "textbox-align-y-center-label": "Center",
    "textbox-align-y-bottom-label": "Bottom",

    "text-align-label": "Text Alignment (x)",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "field-empty-hint-prefix": "The field {field} has no content",
    "fields-empty-hint-prefix": "The fields {fields} have no content",
    "image-slot-empty-hint-prefix": "The selected image slot doesn't have a linked image",
    "learn-more": "learn more"
  },
  "de": {
    "layout-label": "Layout",

    "item-card-label": "Category text",
    "category-placeholder": "Category name",
    "category-name": "Category name",
    "category-description-1": "Category description 1",
    "category-description-2": "Category description 2",
    "short-description": "Short description",
    "drag-reorder-aria": "Drag to reorder",
    "padding-label": "Padding",
    "spacing-around": "Spacing around the text elements",

    "image-label": "Image",
    "display-category-image-label": "Display category image",
    "off": "Off",
    "image-1": "Image 1",
    "image-2": "Image 2",

    "image-scalling-label": "Image Scaling",
    "image-scalling-tooltip": "Fit: The image maintains its original aspect ratio and fits inside the available space, allowing padding. Fill: The image completely fills the available space, potentially cropping parts of the image, and ignores padding.",
    "image-scalling-fit-label": "Fit",
    "image-scalling-fill-label": "Fill",

    "image-brightness-label": "Brightness",
    "image-alt-label": "Alt",
    "image-alt-hint": "Alternative image text",

    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",
    "main-title-label": "Main title",
    "main-title-placeholder": "Title",
    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "SubTitle",
    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",

    "text-color-label": "Text Colour",
    "textbox-background-label": "Textbox Background",
    "textbox-color-label": "Textbox Colour",
    "textbox-opacity-label": "Textbox Opacity",

    "textbox-align-x-label": "Textbox Alignment (x)",
    "textbox-align-x-left-label": "Left",
    "textbox-align-x-center-label": "Center",
    "textbox-align-x-right-label": "Right",

    "textbox-align-y-label": "Textbox Alignment (y)",
    "textbox-align-y-top-label": "Top",
    "textbox-align-y-center-label": "Center",
    "textbox-align-y-bottom-label": "Bottom",

    "text-align-label": "Text Alignment (x)",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "field-empty-hint-prefix": "The field {field} has no content",
    "fields-empty-hint-prefix": "The fields {fields} have no content",
    "image-slot-empty-hint-prefix": "The selected image slot doesn't have a linked image",
    "learn-more": "learn more"
  }
}
</i18n>
