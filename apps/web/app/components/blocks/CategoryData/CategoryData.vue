<template>
  <div :style="inlineStyle" data-testid="category-data">
    <template
      v-if="props.content.displayCategoryImage === 'off' || (!imageUrl && props.content.displayCategoryImage !== 'off')"
    >
      <div
        v-if="shouldShowTextBlock"
        data-testid="text-card"
        :class="['w-full']"
        :style="{
          color: props.content.text.color,
          backgroundColor: props.content.text.bgColor,
        }"
      >
        <div
          v-if="showNoTextMessage"
          class="text-center"
          role="alert"
          aria-live="polite"
          data-testid="no-text-selected"
        >
          {{ getEditorTranslation('no-text-fields-selected') }}
        </div>
        <FieldsOrder
          v-else-if="detailsReady"
          :fields="props.content.fields"
          :fields-order="props.content.fieldsOrder"
          :texts="texts"
        />
      </div>
    </template>
    <template v-else>
      <div class="relative">
        <NuxtImg
          v-if="imageUrl"
          :src="imageUrl"
          :alt="props.content.image?.alt ?? ''"
          :class="['object-cover', 'w-full']"
          :style="{
            filter: props.content.image?.brightness ? 'brightness(' + (props.content.image?.brightness ?? 1) + ')' : '',
            aspectRatio: 'auto 640 / 360',
            width: '100%',
            height: 'auto',
          }"
          :loading="'lazy'"
          :data-testid="'category-data-image-' + meta.uuid"
        />

        <div
          v-if="shouldShowTextBlock"
          :class="[
            'absolute max-w-screen-3xl mx-auto inset-0 p-4 flex flex-col md:basis-2/4',
            { 'md:p-10': props.content.text.bgColor },
          ]"
          :style="{
            color: props.content.text.color,
            textAlign: getTextAlignment(props.content.text.textAlignment ?? ''),
            alignItems: getContentPosition(props.content.text.align ?? ''),
            justifyContent: getContentPosition(props.content.text.justify ?? ''),
          }"
          :data-testid="'category-data-overlay-' + meta.uuid"
        >
          <div
            :class="categoryDataContentClass"
            :style="{
              backgroundColor: props.content.text.background
                ? hexToRgba(props.content.text.bgColor, props.content.text.bgOpacity)
                : '',
            }"
            :data-testid="'category-data-content-' + meta.uuid"
          >
            <div
              v-if="showNoTextMessage"
              class="text-center"
              role="alert"
              aria-live="polite"
              data-testid="no-text-selected"
            >
              {{ getEditorTranslation('no-text-fields-selected') }}
            </div>
            <FieldsOrder
              v-else-if="detailsReady"
              :fields="props.content.fields"
              :fields-order="props.content.fieldsOrder"
              :texts="texts"
            />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { type Category, categoryGetters } from '@plentymarkets/shop-api';
import type { CategoryData, CategoryDataProps } from '~/components/blocks/CategoryData/types';
import type { CategoryDetails } from '@plentymarkets/shop-api/server/types';
import FieldsOrder from './FieldsOrder.vue';

const runtimeConfig = useRuntimeConfig();

const props = defineProps<CategoryDataProps>();
const { hexToRgba, getTextAlignment, getContentPosition, isMobile } = useBlockContentHelper();
const { data: productsCatalog } = useProducts();
const category = computed(() => productsCatalog.value.category || ({} as Category));
const enabledText = computed(
  () =>
    (props.content.fields.name && details.value.name) ||
    (props.content.fields.description1 && details.value.description) ||
    (props.content.fields.description2 && details.value.description2) ||
    (props.content.fields.shortDescription && details.value.shortDescription),
);
const showNoTextMessage = computed(() => !enabledText.value);
const { isEditMode, isPreviewMode, isLiveMode } = useEditorState();
const shouldShowTextBlock = computed(
  () =>
    isEditMode.value ||
    (isPreviewMode.value && !showNoTextMessage.value) ||
    (isLiveMode.value && !showNoTextMessage.value),
);

const details = computed(() => categoryGetters.getCategoryDetails(category.value) || ({} as CategoryDetails));
const texts = computed<CategoryData>(() => {
  const fields = props.content.fields || {};
  const detailsText = details.value || ({} as CategoryDetails);
  return {
    name: fields.name && detailsText.name ? detailsText.name : '',
    description1: fields.description1 && detailsText.description ? detailsText.description : '',
    description2: fields.description2 && detailsText.description2 ? detailsText.description2 : '',
    shortDescription: fields.shortDescription && detailsText.shortDescription ? detailsText.shortDescription : '',
  };
});

const detailsReady = computed(() => {
  const textsData = texts.value;
  return !!(textsData.name || textsData.description1 || textsData.description2 || textsData.shortDescription);
});
const imagePath = computed(() => {
  if (props.content.displayCategoryImage === 'image-1') {
    return details.value.imagePath;
  }
  if (props.content.displayCategoryImage === 'image-2') {
    return details.value.image2Path;
  }
  return '';
});

const imageUrl = computed(() => {
  return imagePath.value ? `${runtimeConfig.public.domain}/documents/${imagePath.value}` : '';
});

const inlineStyle = computed(() => {
  const layout = props.content.layout || {};

  return {
    paddingTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    paddingBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    paddingLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    paddingRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
  };
});

const categoryDataContentClass = computed(() => {
  return isMobile.value ? 'p-4 md:p-6 rounded-lg w-full' : 'p-4 md:p-6 rounded-lg md:max-w-[50%] mx-5';
});
</script>
<i18n lang="json">
{
  "en": {
    "no-text-fields-selected": "No text fields are selected."
  },
  "de": {
    "no-text-fields-selected": "No text fields are selected."
  }
}
</i18n>
