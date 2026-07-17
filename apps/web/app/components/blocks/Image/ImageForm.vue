<template>
  <EditorFormPanel
    v-model="imageGroupOpen"
    :title="getEditorTranslation('images-group-label')"
    data-testid="image-group"
  >
    <div class="images">
      <UiImagePicker
        v-for="type in imageTypes"
        :key="type"
        :label="labels[type]"
        :image="uiImageTextBlock.image[type]"
        :placeholder="placeholderImg"
        :dimensions="imageDimensions[type]"
        :selected-image-type="type"
        @add="(payload) => handleImageAddWrapper(payload)"
        @delete="deleteImage(uiImageTextBlock.image, type)"
      />
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel for="image-form-alt">{{ getEditorTranslation('alt-label') }}</UiFormLabel>
      </div>
      <SfInput id="image-form-alt" v-model="uiImageTextBlock.image.alt" type="text" data-testid="alt-input" />
    </div>

    <div class="py-2">
      <label for="image-form-brightness" class="block text-sm font-medium mb-4">Brightness</label>
      <div class="flex items-center gap-4">
        <div class="flex-1 space-y-1">
          <div class="flex justify-between text-xs text-gray-500">
            <span>0%</span>
            <span>100%</span>
          </div>
          <input
            id="image-form-brightness"
            v-model.number="uiImageTextBlock.image.brightness"
            type="range"
            min="0"
            max="1"
            step="0.01"
            class="w-full"
            aria-label="Brightness slider"
          />
        </div>

        <div class="relative">
          <input
            id="image-form-brightness-number"
            v-model.number="uiImageTextBlock.image.brightness"
            type="number"
            min="0"
            max="1"
            aria-label="Brightness value"
            class="w-20 px-2 py-1 border rounded text-color-red-500"
            @input="clampBrightness($event, 'image')"
          />
        </div>
      </div>
    </div>

    <div class="py-2">
      <EditorOptionsTabs
        v-model="fillModeModel"
        :legend="getEditorTranslation('image-scalling-label')"
        :tooltip="fillTooltip"
        tooltip-placement="top"
        test-id-prefix="image-scaling"
        :options="fillModeOptions"
      />
    </div>
    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel for="image-form-linktarget">{{ getEditorTranslation('linktarget-label') }}</UiFormLabel>
      </div>
      <SfInput
        id="image-form-linktarget"
        v-model="uiImageTextBlock.image.linktarget"
        type="text"
        data-testid="linktarget-input"
      />
    </div>
  </EditorFormPanel>
  <EditorFormPanel v-model="textGroupOpen" :title="getEditorTranslation('text-overlay-label')" data-testid="text-group">
    <EditorRichTextEditorForm
      :model-value="uiImageTextBlock.text.textOverlay ?? ''"
      :text-align="uiImageTextBlock.text.textOverlayAlignX"
      :block-uuid="blockUuid"
      @update:model-value="uiImageTextBlock.text.textOverlay = $event"
    />

    <div class="py-2">
      <EditorOptionsTabs
        v-model="textOverlayAlignXModel"
        :legend="getEditorTranslation('text-overlay-align-x-label')"
        test-id-prefix="text-overlay-align-x"
        :options="textOverlayAlignXOptions"
      />
    </div>

    <div class="py-2">
      <EditorOptionsTabs
        v-model="textOverlayAlignYModel"
        :legend="getEditorTranslation('text-overlay-align-y-label')"
        test-id-prefix="text-overlay-align-y"
        :options="textOverlayAlignYOptions"
      />
    </div>
  </EditorFormPanel>

  <EditorFormPanel
    v-model="buttonOpen"
    :title="getEditorTranslation('button-group-label')"
    data-testid="slider-button-group-title"
  >
    <div class="images">
      <div class="mb-6 mt-4">
        <UiFormLabel class="mb-1" for="image-form-button-label">
          {{ getEditorTranslation('button-text-label') }}
        </UiFormLabel>
        <SfInput
          id="image-form-button-label"
          v-model="uiImageTextBlock.button.label"
          data-testid="slider-button-label"
          name="label"
          type="text"
          :placeholder="getEditorTranslation('button-text-placeholder')"
        />
      </div>
      <div class="mb-6">
        <UiFormLabel for="image-form-button-link" class="mb-1">{{
          getEditorTranslation('button-link-label')
        }}</UiFormLabel>
        <SfInput
          id="image-form-button-link"
          v-model="uiImageTextBlock.button.link"
          name="link"
          data-testid="slider-button-link"
          type="text"
          :placeholder="getEditorTranslation('button-link-placeholder')"
        />
      </div>
      <div class="mb-6">
        <EditorOptionsTabs
          v-model="buttonVariantModel"
          :legend="getEditorTranslation('button-variant-label')"
          test-id-prefix="slider-button-variant"
          :options="buttonVariantOptions"
        />
      </div>

      <div class="mb-6">
        <EditorOptionsTabs
          v-model="buttonAlignModel"
          :legend="getEditorTranslation('button-align-label')"
          test-id-prefix="slider-button-align"
          :options="buttonAlignOptions"
        />
      </div>
    </div>
  </EditorFormPanel>
  <EditorFormPanel
    v-model="layoutOpen"
    :title="getEditorTranslation('layout-label')"
    data-testid="slider-button-group-title"
  >
    <div class="py-2 flex items-center justify-between gap-3">
      <UiFormLabel for="keep-transparent" class="m-0">
        {{ getEditorTranslation('keep-transparent-label') }}
      </UiFormLabel>

      <SfSwitch
        id="keep-transparent"
        v-model="isTransparent"
        data-testid="switch-keep-transparent"
        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
      />
    </div>

    <div v-if="!isTransparent" class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
      </div>
      <EditorColorPicker v-model="backgroundColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <SfInput v-model="backgroundColor" type="text" data-testid="input-background-color">
            <template #suffix>
              <button
                type="button"
                class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                :style="{ backgroundColor: color }"
                aria-label="Color picker"
                @mousedown.stop
                @click.stop="toggle"
              />
            </template>
          </SfInput>
        </template>
      </EditorColorPicker>
    </div>
    <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
    <div
      id="padding-form"
      class="py-2"
      :class="uiImageTextBlock.image.fillMode !== 'fit' ? 'opacity-60  cursor-not-allowed' : ''"
    >
      <div class="flex items-center gap-2 mb-2">
        <UiFormLabel class="m-0">{{ getEditorTranslation('padding-label') }}</UiFormLabel>
        <SfTooltip :label="paddingTooltip" placement="right">
          <span class="flex items-center">
            <SfIconInfo size="sm" />
          </span>
        </SfTooltip>
      </div>

      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            id="image-form-padding-top"
            v-model.number="uiImageTextBlock.layout.paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
            :disabled="uiImageTextBlock.image.fillMode !== 'fit'"
            aria-label="Top padding"
          />
        </div>

        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            id="image-form-padding-bottom"
            v-model.number="uiImageTextBlock.layout.paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
            :disabled="uiImageTextBlock.image.fillMode !== 'fit'"
            aria-label="Bottom padding"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            id="image-form-padding-left"
            v-model.number="uiImageTextBlock.layout.paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
            :disabled="uiImageTextBlock.image.fillMode !== 'fit'"
            aria-label="Left padding"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            id="image-form-padding-right"
            v-model.number="uiImageTextBlock.layout.paddingRight"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-right"
            :disabled="uiImageTextBlock.image.fillMode !== 'fit'"
            aria-label="Right padding"
          />
        </div>
      </div>
    </div>
  </EditorFormPanel>
</template>

<script setup lang="ts">
import {
  SfInput,
  SfIconArrowBack,
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowForward,
  SfSwitch,
  SfTooltip,
  SfIconInfo,
} from '@storefront-ui/vue';

import type { ImageFormProps, ImageTypeKey } from './types';
import type { ImageContent } from '~/components/blocks/Image/types';
import { migrateImageContent } from '~/utils/migrate-image-content';
import { clamp } from '@storefront-ui/shared';

const { placeholderImg, labels, imageDimensions, imageTypes, deleteImage } = usePickerHelper();
const { allBlocks: data } = useBlocks();

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<ImageFormProps>();

const DEFAULT_LAYOUT = {
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
};

const {
  fillModeModel,
  fillModeOptions,
  textOverlayAlignXModel,
  textOverlayAlignXOptions,
  textOverlayAlignYModel,
  textOverlayAlignYOptions,
  buttonVariantModel,
  buttonVariantOptions,
  buttonAlignModel,
  buttonAlignOptions,
} = useEditorOptionsTabs(() => uiImageTextBlock.value, getEditorTranslation);

const uiImageTextBlock = computed(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content || {};
  const migrated = migrateImageContent(rawContent as ImageContent | OldContent);

  if (migrated.layout) {
    (Object.keys(DEFAULT_LAYOUT) as Array<keyof typeof DEFAULT_LAYOUT>).forEach((key) => {
      if (typeof migrated.layout[key] !== 'number') {
        migrated.layout[key] = DEFAULT_LAYOUT[key];
      }
    });
  } else {
    migrated.layout = { ...DEFAULT_LAYOUT };
  }

  if (!migrated.button) {
    migrated.button = { alignment: 'center' };
  } else if (!migrated.button.alignment) {
    migrated.button.alignment = 'center';
  }

  return migrated;
});

const { isFullWidth } = useFullWidthToggleForContent(uiImageTextBlock);

const backgroundColorInit = uiImageTextBlock.value.layout.backgroundColor;
const isTransparent = ref(!backgroundColorInit || backgroundColorInit === 'transparent');
const backgroundColor = ref(isTransparent.value ? '' : backgroundColorInit);

watch([isTransparent, backgroundColor], () => {
  uiImageTextBlock.value.layout.backgroundColor = isTransparent.value ? 'transparent' : backgroundColor.value;
});

watch(fillModeModel, (newMode) => {
  if (newMode === 'fill') {
    uiImageTextBlock.value.layout.paddingTop = 0;
    uiImageTextBlock.value.layout.paddingBottom = 0;
    uiImageTextBlock.value.layout.paddingLeft = 0;
    uiImageTextBlock.value.layout.paddingRight = 0;
  }
});

const imageGroupOpen = ref(true);
const textGroupOpen = ref(true);
const buttonOpen = ref(true);
const layoutOpen = ref(true);

const fillTooltip =
  'Fit: The image maintains its original aspect ratio and fits inside the available space, allowing padding. Fill: The image completely fills the available space, potentially cropping parts of the image, and ignores padding.';

const paddingTooltip = 'Padding is only available in Fit mode.';

const handleImageAddWrapper = ({ image, type }: { image: string; type: string }) => {
  if (uiImageTextBlock.value.image && ['wideScreen', 'desktop', 'tablet', 'mobile'].includes(type)) {
    uiImageTextBlock.value.image[type as ImageTypeKey] = image;
  }
};

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);
  if (type === 'image') {
    uiImageTextBlock.value.image.brightness = clamp(nextValue, 0, 1);
  }
};
</script>

<i18n lang="json">
{
  "en": {
    "images-group-label": "Images",

    "image-scalling-label": "Image Scaling",
    "image-scalling-fit-label": "Fit",
    "image-scalling-fill-label": "Fill",

    "layout-label": "Layout",

    "alt-label": "Alt",
    "linktarget-label": "Link-Target",
    "padding-label": "Padding",

    "text-overlay-label": "Text",

    "background-color-label": "Background Color",

    "keep-transparent-label": "Keep background transparent",

    "text-overlay-align-x-label": "Horizontal Alignment (x)",
    "text-overlay-align-x-left": "Left",
    "text-overlay-align-x-center": "Center",
    "text-overlay-align-x-right": "Right",
    "text-overlay-align-y-label": "Vertical Alignment (y)",
    "text-overlay-align-y-top": "Top",
    "text-overlay-align-y-center": "Center",
    "text-overlay-align-y-bottom": "Bottom",
    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-text-placeholder": "Button",
    "button-link-label": "Link Target",
    "button-link-placeholder": "Enter URL here",
    "button-variant-label": "Variant",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary",
    "button-align-label": "Button Alignment (x)",
    "button-align-option-left-label": "Left",
    "button-align-option-center-label": "Center",
    "button-align-option-right-label": "Right"
  },
  "de": {
    "images-group-label": "Images",

    "image-scalling-label": "Image Scaling",
    "image-scalling-fit-label": "Fit",
    "image-scalling-fill-label": "Fill",
    "background-color-label": "Background Color",

    "layout-label": "Layout",

    "alt-label": "Alt",
    "linktarget-label": "Link-Target",
    "padding-label": "Padding",
    "keep-transparent-label": "Keep background transparent",

    "text-overlay-label": "Text",

    "text-overlay-align-x-label": "Horizontal Alignment (x)",
    "text-overlay-align-x-left": "Left",
    "text-overlay-align-x-center": "Center",
    "text-overlay-align-x-right": "Right",
    "text-overlay-align-y-label": "Vertical Alignment (y)",
    "text-overlay-align-y-top": "Top",
    "text-overlay-align-y-center": "Center",
    "text-overlay-align-y-bottom": "Bottom",
    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-text-placeholder": "Button",
    "button-link-label": "Link Target",
    "button-link-placeholder": "Enter URL here",
    "button-variant-label": "Variant",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary",
    "button-align-label": "Button Alignment (x)",
    "button-align-option-left-label": "Left",
    "button-align-option-center-label": "Center",
    "button-align-option-right-label": "Right"
  }
}
</i18n>
