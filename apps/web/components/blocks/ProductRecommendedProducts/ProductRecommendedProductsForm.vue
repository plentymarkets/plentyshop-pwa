<template>
  <UiAccordionItem
    v-model="textSettings"
    data-testid="open-text-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('text-group-label') }}</h2>
    </template>

    <div class="p-2 sticky top-[52px] h-[calc(100vh-150px)] overflow-y-auto">
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
      <div class="p-2">
        <UiFormLabel>{{ getEditorTranslation('category-id-label') }}</UiFormLabel>
        <SfInput
          :model-value="recommendedBlock.categoryId"
          data-testid="recommended-form-categoryid"
          name="category Id"
          type="text"
          :placeholder="getEditorTranslation('category-id-placeholder')"
          @input="debouncedFn($event)"
        />
      </div>
      <div v-if="recommendedBlock.text" class="p-2">
        <UiFormLabel>{{ getEditorTranslation('text-color-label') }}</UiFormLabel>
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
    </div>
  </UiAccordionItem>
  <UiAccordionItem
    v-model="layoutSettings"
    data-testid="layout-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('layout-group-label') }}</h2>
    </template>
    <MarginInput v-model="marginModel" :label="getEditorTranslation('margin-label')" />
  </UiAccordionItem>
</template>

<script setup lang="ts">
import type { ProductRecommendedProductsContent } from '../ProductRecommendedProducts/types';
import { SfInput, SfTextarea, SfIconCheck } from '@storefront-ui/vue';
import { useDebounceFn } from '@vueuse/core';

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();
const textSettings = ref(false);
const layoutSettings = ref(false);

const recommendedBlock = computed(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, blockUuid.value)?.content || {};

  const content = rawContent as Partial<ProductRecommendedProductsContent>;

  if (!content.text) {
    content.text = {
      pretitle: '',
      title: '',
      subtitle: '',
      htmlDescription: '',
      color: '#000000',
      textAlignment: 'left',
    };
  } else {
    content.text.pretitle = content.text.pretitle ?? '';
    content.text.title = content.text.title ?? '';
    content.text.subtitle = content.text.subtitle ?? '';
    content.text.htmlDescription = content.text.htmlDescription ?? '';
    content.text.color = content.text.color ?? '#000000';
    content.text.textAlignment = content.text.textAlignment ?? 'left';
  }

  if (!content.layout) {
    content.layout = {
      marginTop: '0',
      marginBottom: '0',
      marginLeft: '0',
      marginRight: '0',
    };
  } else {
    content.layout.marginTop = content.layout.marginTop ?? '0';
    content.layout.marginBottom = content.layout.marginBottom ?? '0';
    content.layout.marginLeft = content.layout.marginLeft ?? '0';
    content.layout.marginRight = content.layout.marginRight ?? '0';
  }

  content.categoryId = content.categoryId ?? '';

  return content as ProductRecommendedProductsContent;
});

const marginModel = useMarginModel(recommendedBlock.value.layout);

const debouncedFn = useDebounceFn((event: Event) => {
  const target = event.target as HTMLInputElement;
  recommendedBlock.value.categoryId = target.value.toString();
}, 1000);

const isTextAlignSelected = (align: 'left' | 'center' | 'right') => {
  return (recommendedBlock.value.text.textAlignment || 'left') === align;
};
</script>

<i18n lang="json">
{
  "en": {
    "text-group-label": "Text",
    "layout-group-label": "Layout",
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",
    "margin-label": "Margin",
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
    "text-align-option-right-label": "Right"
  },
  "de": {
    "text-group-label": "Text",
    "layout-group-label": "Layout",
    "pretitle-label": "Pre-title",
    "pretitle-placeholder": "PreTitle",
    "margin-label": "Margin",
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
    "text-align-option-right-label": "Right"
  }
}
</i18n>
