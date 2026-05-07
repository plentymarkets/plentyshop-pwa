<template>
  <div class="sticky h-[80vh] overflow-y-auto">
    <UiAccordionItem
      v-model="textsOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      data-testid="open-recommended-products-form-texts"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('texts-label') }}</h2>
      </template>
      <EditorRichTextEditorForm
        v-if="recommendedBlock.text"
        :model-value="recommendedBlock.text.htmlDescription ?? ''"
        :text-align="recommendedBlock.text.textAlignment ?? 'left'"
        @update:model-value="recommendedBlock.text.htmlDescription = $event"
      />
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

      <div class="py-2">
        <EditorOptionsTabs
          v-model="sourceTypeModel"
          :legend="getEditorTranslation('source-type-label')"
          test-id-prefix="recommended-form-source"
          :options="sourceTypeOptions"
        />
      </div>

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
          data-testid="recommended-form-categories"
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
import { SfInput } from '@storefront-ui/vue';
import { useDebounceFn } from '@vueuse/core';
import { productGetters } from '@plentymarkets/shop-api';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

const props = defineProps<{ uuid?: string }>();

const { allBlocks: data } = useBlocks();
const { blockUuid } = useSiteConfiguration();
const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const { findOrDeleteBlockByUuid } = useBlockManager();
const { currentProduct } = useProducts();
const { data: categoryTree } = useCategoryTree();
const layoutOpen = ref(true);

const recommendedBlock = computed(
  () =>
    (findOrDeleteBlockByUuid(data.value, resolvedUuid.value)?.content || {
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

const { sourceTypeModel, sourceTypeOptions } = useEditorOptionsTabs(() => recommendedBlock.value, getEditorTranslation);
</script>

<i18n lang="json">
{
  "en": {
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
    "layout-label": "Layout",
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
