<template>
  <div class="sticky top-[52px] h-[80vh] overflow-y-auto">
    <UiAccordionItem
      v-model="textsOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="open-recommended-products-form-texts"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('texts-label') }}</h2>
      </template>

      <div v-if="recommendedBlock.text" class="p-2">
        <UiFormLabel>{{ getEditorTranslation('pretitle-label') }}</UiFormLabel>
        <SfInput
          v-model="recommendedBlock.text.pretitle"
          data-testid="recommended-form-pretitle"
          name="preTitle"
          type="text"
          :placeholder="getEditorTranslation('pretitle-placeholder')"
        />
      </div>
      <div v-if="recommendedBlock.text" class="p-2">
        <UiFormLabel>{{ getEditorTranslation('main-title-label') }}</UiFormLabel>
        <SfInput
          v-model="recommendedBlock.text.title"
          data-testid="recommended-form-title"
          name="Title"
          type="text"
          :placeholder="getEditorTranslation('main-title-placeholder')"
        />
      </div>
      <div v-if="recommendedBlock.text" class="p-2">
        <UiFormLabel>{{ getEditorTranslation('subtitle-label') }}</UiFormLabel>
        <SfInput
          v-model="recommendedBlock.text.subtitle"
          data-testid="recommended-form-subtitle"
          name="Subtitle"
          type="text"
          :placeholder="getEditorTranslation('subtitle-placeholder')"
        />
      </div>
      <div v-if="recommendedBlock.text" class="p-2">
        <UiFormLabel>{{ getEditorTranslation('description-label') }}</UiFormLabel>
        <SfTextarea
          v-model="recommendedBlock.text.htmlDescription"
          name="description"
          type="text"
          class="w-full min-h-[232px]"
          :placeholder="getEditorTranslation('description-placeholder')"
          data-testid="recommended-form-html"
        />
      </div>
      <div v-if="recommendedBlock.text" class="p-2">
        <UiFormLabel>{{ getEditorTranslation('text-color-label') }}</UiFormLabel>
        <div v-if="runtimeConfig.enableColorPicker">
          <SfInput v-model="recommendedBlock.text.color" type="text" data-testid="recommended-form-color">
            <template #suffix>
              <label
                for="text-color"
                :style="{ backgroundColor: recommendedBlock.text.color }"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer"
              >
                <input id="text-color" v-model="recommendedBlock.text.color" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </div>
        <EditorColorPicker v-else v-model="recommendedBlock.text.color!" class="w-full">
          <template #trigger="{ color, toggle }">
            <SfInput v-model="recommendedBlock.text.color" type="text" data-testid="recommended-form-color">
              <template #suffix>
                <button
                  type="button"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                  :style="{ backgroundColor: color }"
                  @mousedown.stop
                  @click.stop="toggle"
                />
              </template>
            </SfInput>
          </template>
        </EditorColorPicker>
      </div>
      <div v-if="recommendedBlock.text" class="p-2">
        <UiFormLabel>{{ getEditorTranslation('text-align-label') }}</UiFormLabel>
        <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            for="text-align-left"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': isTextAlignSelected('left') }"
            data-testid="recommended-form-text-align-left"
            @click="recommendedBlock.text.textAlignment = 'left'"
          >
            <SfIconCheck :class="{ invisible: !isTextAlignSelected('left') }" class="mr-1 w-[1.1rem]" />
            {{ getEditorTranslation('text-align-option-left-label') }}
          </div>
          <div
            for="text-align-center"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': isTextAlignSelected('center') }"
            data-testid="recommended-form-text-align-center"
            @click="recommendedBlock.text.textAlignment = 'center'"
          >
            <SfIconCheck :class="{ invisible: !isTextAlignSelected('center') }" class="mr-1 w-[1.1rem]" />
            {{ getEditorTranslation('text-align-option-center-label') }}
          </div>
          <div
            for="text-align-right"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': isTextAlignSelected('right') }"
            data-testid="recommended-form-text-align-right"
            @click="recommendedBlock.text.textAlignment = 'right'"
          >
            <SfIconCheck :class="{ invisible: !isTextAlignSelected('right') }" class="mr-1 w-[1.1rem]" />
            {{ getEditorTranslation('text-align-option-right-label') }}
          </div>
        </div>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="sourceOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="open-recommended-products-form-source"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('source-label') }}</h2>
      </template>

      <fieldset class="py-2">
        <legend class="text-sm font-medium text-black">
          {{ getEditorTranslation('source-type-label') }}
        </legend>

        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <div
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': recommendedBlock.source.type === 'cross_selling' }"
            data-testid="recommended-form-source-product"
            @click="recommendedBlock.source.type = 'cross_selling'"
          >
            <SfIconCheck
              :class="{ invisible: recommendedBlock.source.type !== 'cross_selling' }"
              class="mr-1 w-[1.1rem]"
            />
            {{ getEditorTranslation('source-type-product') }}
          </div>

          <div
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': recommendedBlock.source.type === 'category' }"
            data-testid="recommended-form-source-category"
            @click="selectCategoryTab()"
          >
            <SfIconCheck :class="{ invisible: recommendedBlock.source.type !== 'category' }" class="mr-1 w-[1.1rem]" />
            {{ getEditorTranslation('source-type-category') }}
          </div>
        </div>
      </fieldset>

      <div v-if="recommendedBlock.source.type === 'cross_selling'" class="py-4">
        <UiFormLabel>{{ getEditorTranslation('product-id-label') }}</UiFormLabel>
        <SfInput
          :model-value="recommendedBlock.source.itemId"
          data-testid="recommended-form-itemId"
          name="itemId"
          type="text"
          :placeholder="getEditorTranslation('product-id-placeholder')"
          :disabled="Object.keys(currentProduct).length > 0"
          :wrapper-class="{ '!bg-disabled-100 !ring-disabled-300 !ring-1': Object.keys(currentProduct).length > 0 }"
          @input="debouncedFn($event)"
        />

        <div class="py-4">
          <UiFormLabel>{{ getEditorTranslation('cross-selling-relation-label') }}</UiFormLabel>
          <Multiselect
            v-model="crossSellingModel"
            :options="crossSellingOptions"
            :allow-empty="false"
            :multiple="false"
            label="label"
            track-by="value"
            placeholder="Select relation"
            data-testid="recommended-form-cross-selling-relation"
            class="w-full"
          />
        </div>
      </div>

      <div v-else class="py-4">
        <UiFormLabel>{{ getEditorTranslation('categories-label') }}</UiFormLabel>

        <EditorCategorySelect
          v-model="categoryIdModel"
          :base-search-params="{ type: 'in:item', sortBy: 'position_asc,name_asc', with: 'details,clients' }"
          data-test-id="recommended-form-categories"
        />
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="layoutOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 data-testid="slider-button-group-title">{{ getEditorTranslation('layout-label') }}</h2>
      </template>

      <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import type { CrossSellingRelationType, ProductRecommendedProductsContent } from '../ProductRecommendedProducts/types';
import { SfInput, SfTextarea, SfIconCheck } from '@storefront-ui/vue';
import { useDebounceFn } from '@vueuse/core';
import { productGetters } from '@plentymarkets/shop-api';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

const runtimeConfig = useRuntimeConfig().public;

const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();
const { currentProduct } = useProducts();
const { data: categoryTree } = useCategoryTree();
const layoutOpen = ref(true);

const recommendedBlock = computed(
  () =>
    (findOrDeleteBlockByUuid(data.value, blockUuid.value)?.content || {
      text: {
        pretitle: '',
        title: '',
        subtitle: '',
        htmlDescription: '',
        color: '#000000',
        textAlignment: 'left',
      },
      source: {
        type: 'category',
        categoryId: '',
        crossSellingRelation: 'Similar' as CrossSellingRelationType,
      },
    }) as ProductRecommendedProductsContent,
);

if (Object.keys(currentProduct.value).length) {
  recommendedBlock.value.source.itemId = productGetters.getItemId(currentProduct.value);
}

const debouncedFn = useDebounceFn((event: Event) => {
  const target = event.target as HTMLInputElement;
  recommendedBlock.value.source.itemId = target.value.toString();
}, 1000);

const isTextAlignSelected = (align: 'left' | 'center' | 'right') => {
  return (recommendedBlock.value.text.textAlignment || 'left') === align;
};

const sourceOpen = ref(false);
const textsOpen = ref(false);
const crossSellingOptions = [
  { value: 'Accessory', label: getEditorTranslation('cross-selling-relation-accessory') },
  { value: 'ReplacementPart', label: getEditorTranslation('cross-selling-relation-replacement') },
  { value: 'Similar', label: getEditorTranslation('cross-selling-relation-similar') },
  { value: 'Bundle', label: getEditorTranslation('cross-selling-relation-bundle') },
];

const crossSellingModel = computed({
  get() {
    return crossSellingOptions.find((o) => o.value === recommendedBlock.value.source.crossSellingRelation) ?? null;
  },
  set(option) {
    recommendedBlock.value.source.crossSellingRelation = (option?.value || 'Similar') as CrossSellingRelationType;
  },
});

const firstCategoryId = (categoryTree.value?.find((category) => category.type === 'item')?.id || '').toString();

const categoryIdModel = computed({
  get() {
    return recommendedBlock.value.source?.categoryId || firstCategoryId;
  },
  set(value: string | null) {
    if (!recommendedBlock.value.source) {
      recommendedBlock.value.source = {
        type: 'cross_selling',
        itemId: '',
        categoryId: firstCategoryId,
        crossSellingRelation: 'Similar',
      };
    }
    recommendedBlock.value.source.categoryId = value || '';
  },
});

const recommendedBlockRef = ref(recommendedBlock.value);

const { isFullWidth } = useFullWidthToggleForContent(recommendedBlockRef);

const selectCategoryTab = async () => {
  recommendedBlock.value.source.type = 'category';
};
</script>

<i18n lang="json">
{
  "en": {
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",

    "main-title-label": "Main Title",
    "main-title-placeholder": "Title",

    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "Subtitle",

    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",

    "category-id-label": "Category ID",
    "category-id-placeholder": "Enter Category Id",

    "text-color-label": "Text Colour",

    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "texts-label": "Texts",
    "source-label": "Source",
    "source-type-label": "Choose source",
    "source-type-product": "Product",
    "source-type-category": "Category",
    "product-id-label": "Product ID",
    "product-id-placeholder": "Enter Product ID",
    "categories-label": "Categories",
    "layout-label": "Layout",
    "cross-selling-relation-label": "Cross-selling relation",
    "cross-selling-relation-accessory": "Accessory",
    "cross-selling-relation-replacement": "Replacement part",
    "cross-selling-relation-similar": "Similar",
    "cross-selling-relation-bundle": "Item bundle"
  },
  "de": {
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",

    "main-title-label": "Main Title",
    "main-title-placeholder": "Title",

    "subtitle-label": "Subtitle",
    "subtitle-placeholder": "Subtitle",

    "description-label": "Description",
    "description-placeholder": "Text that supports HTML formatting",

    "category-id-label": "Category ID",
    "category-id-placeholder": "Enter Category Id",

    "text-color-label": "Text Colour",
    "layout-label": "Layout",
    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "texts-label": "Texts",
    "source-label": "Source",
    "source-type-label": "Choose source",
    "source-type-product": "Product",
    "source-type-category": "Category",
    "product-id-label": "Product ID",
    "product-id-placeholder": "Enter Product ID",
    "categories-label": "Categories",

    "cross-selling-relation-label": "Cross-selling relation",
    "cross-selling-relation-accessory": "Accessory",
    "cross-selling-relation-replacement": "Replacement part",
    "cross-selling-relation-similar": "Similar",
    "cross-selling-relation-bundle": "Item bundle"
  }
}
</i18n>
