<template>
  <div :style="inlineStyle" data-testid="category-data">
    <template v-if="props.content.displayCategoryImage === 'off'">
      <div
        data-testid="text-card"
        :class="['w-full', 'flex', 'flex-col', 'items-center', 'space-y-4']"
        :style="textBlockInlineStyle"
      >
        <TextContent :text="props.content.text" :index="props.index" />
      </div>
    </template>
    <template v-else>
      <div>
        <NuxtImg
          :src="imageUrl"
          :alt="props.content.image?.alt ?? ''"
          :class="[props.content.image.fillMode === 'fit' ? 'object-contain' : 'object-cover', 'w-full']"
          :style="{
            filter: props.content.image?.brightness ? 'brightness(' + (props.content.image?.brightness ?? 1) + ')' : '',
            height: getImageHeight(),
          }"
          :loading="'lazy'"
          :data-testid="'category-data-image-' + meta.uuid"
        />

        <div
          v-if="props.content.text"
          :class="['absolute inset-0 p-4 flex flex-col md:basis-2/4', { 'md:p-10': props.content.text.bgColor }]"
          :style="{
            color: props.content.text.color,
            textAlign: getTextAlignment(),
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
              v-if="props.content.text.pretitle"
              class="typography-headline-6 font-bold tracking-widest"
              :data-testid="'category-data-pretitle-' + meta.uuid"
              v-html="props.content.text.pretitle"
            />

            <h1
              v-if="props.content.text.title"
              :id="`category-data_heading`"
              class="text-2xl font-semibold mb-4"
              :data-testid="'category-data-title-' + meta.uuid"
              v-html="props.content.text.title"
            />

            <div
              v-if="props.content.text.subtitle"
              class="typography-headline-6 font-bold tracking-widest mb-4"
              :data-testid="'category-data-subtitle-' + meta.uuid"
              v-html="props.content.text.subtitle"
            />

            <div
              v-if="props.content.text.htmlDescription"
              class="typography-text-sm md:typography-text-lg font-normal"
              :data-testid="'category-data-description-' + meta.uuid"
              v-html="props.content.text.htmlDescription"
            />
          </div>
        </div>
      </div>
    </template>

    <template v-for="key in content.fieldsOrder" :key="key">
      <template v-if="content.fields[key]">
        <h1
          v-if="key === 'name' && name"
          id="category-headline"
          :key="key"
          class="font-bold typography-headline-3 md:typography-headline-2"
          data-testid="category-name"
        >
          {{ name }}
        </h1>

        <p
          v-if="key === 'description1' && description1"
          :key="key"
          data-testid="category-description-1"
          v-html="description1"
        />

        <p
          v-if="key === 'description2' && description2"
          :key="key"
          data-testid="category-description-2"
          v-html="description2"
        />

        <p
          v-if="key === 'shortDescription' && shortDescription"
          :key="key"
          data-testid="category-short-description"
          v-html="shortDescription"
        />
      </template>
    </template>
  </div>
</template>

<script setup lang="ts">
import { type Category, categoryGetters } from '@plentymarkets/shop-api';
import type { CategoryDataProps } from '~/components/blocks/CategoryData/types';
import type { CategoryDetails } from '@plentymarkets/shop-api/server/types';

const runtimeConfig = useRuntimeConfig();

const viewport = useViewport();
const isMobile = computed(() => viewport.isLessThan('lg'));

const props = defineProps<CategoryDataProps>();
const { data: productsCatalog } = useProducts();

const category = computed(() => productsCatalog.value.category || ({} as Category));

const name = computed(() => categoryGetters.getCategoryName(category.value) || '');
const description1 = computed(() => categoryGetters.getCategoryDescription1(category.value) || '');
const description2 = computed(() => categoryGetters.getCategoryDescription2(category.value) || '');
const shortDescription = computed(() => categoryGetters.getCategoryShortDescription(category.value) || '');

const details = computed(() => categoryGetters.getCategoryDetails(category.value) || ({} as CategoryDetails));

const imageUrl = computed(() => {
  return props.content.displayCategoryImage === 'image-1'
    ? runtimeConfig.public.domain + '/documents/' + details.value.imagePath
    : runtimeConfig.public.domain + '/documents/' + details.value.image2Path;
});

const inlineStyle = computed(() => {
  const layout = props.content.layout || {};

  return {
    marginTop: layout.paddingTop ? `${layout.paddingTop}px` : 0,
    marginBottom: layout.paddingBottom ? `${layout.paddingBottom}px` : 0,
    marginLeft: layout.paddingLeft ? `${layout.paddingLeft}px` : 0,
    marginRight: layout.paddingRight ? `${layout.paddingRight}px` : 0,
  };
});

const textBlockInlineStyle = computed(() => {
  return {
    backgroundColor: props.content.text.bgColor ?? 'transparent',
  };
});

const hexToRgba = (hex: string = '#fff', opacity: number = 1) => {
  const cleanHex = hex.replace('#', '');

  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split('')
          .map((c) => c + c)
          .join('')
      : cleanHex;

  const red = parseInt(fullHex.substring(0, 2), 16);
  const green = parseInt(fullHex.substring(2, 4), 16);
  const blue = parseInt(fullHex.substring(4, 6), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

const getImageHeight = () => {
  switch (viewport.breakpoint.value) {
    case '4xl': {
      return '768px';
    }

    case 'lg': {
      return '576px';
    }
    case 'md': {
      return '432px';
    }
    default: {
      return '320px';
    }
  }
};

const getTextAlignment = () => {
  const textAlignment = props.content.text?.textAlignment ?? '';

  switch (textAlignment) {
    case 'center': {
      return 'center';
    }
    case 'right': {
      return 'right';
    }
    default: {
      return 'left';
    }
  }
};

const getContentPosition = (axis: string) => {
  if (isMobile.value) {
    return 'center';
  }

  switch (axis) {
    case 'center': {
      return 'center';
    }
    case 'right': {
      return 'flex-end';
    }
    case 'bottom': {
      return 'flex-end';
    }
    default: {
      return 'flex-start';
    }
  }
};

const categoryDataContentClass = computed(() => {
  return isMobile.value ? 'p-4 md:p-6 rounded-lg w-full' : 'p-4 md:p-6 rounded-lg md:max-w-[50%] mx-5';
});
</script>
