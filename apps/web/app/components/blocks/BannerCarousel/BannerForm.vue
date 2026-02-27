<template>
  <div class="block-slider-edit">
    <div :data-testid="`slide-settings-${activeSlide}`">
      <UiAccordionItem
        v-model="imagesOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
        data-testid="slider-image-group"
      >
        <template #summary>
          <h2 data-testid="slider-image-group-title">{{ getEditorTranslation('images-group-label') }}</h2>
        </template>

        <div class="images">
          <UiImagePicker
            v-for="type in imageTypes"
            :key="type"
            :label="labels[type]"
            :image="banner.content.image[type]"
            :placeholder="placeholderImg"
            :dimensions="imageDimensions[type]"
            :selected-image-type="type"
            @add="(payload) => handleImageAddBanner(payload)"
            @delete="deleteImage(banner.content.image, type)"
          />
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium mb-4">Brightness</label>
          <div class="flex items-center gap-4">
            <div class="flex-1 space-y-1">
              <div class="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>100%</span>
              </div>
              <input
                v-model.number="banner.content.image.brightness"
                type="range"
                min="0"
                max="1"
                step="0.01"
                class="w-full"
              />
            </div>

            <div class="relative">
              <input
                v-model.number="banner.content.image.brightness"
                type="number"
                min="0"
                max="1"
                class="w-20 px-2 py-1 border rounded text-color-red-500"
                @input="clampBrightness($event, 'image')"
              />
            </div>
          </div>
        </div>

        <div class="mb-6">
          <UiFormLabel class="mb-1">Alt</UiFormLabel>
          <SfInput v-model="banner.content.image.alt" name="alt" type="text" data-testid="slide-alt-text" />
          <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Alternative image text</div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="textOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
        data-testid="banner-text-group"
      >
        <template #summary>
          <h2 data-testid="slider-text-group-title">{{ getEditorTranslation('text-group-label') }}</h2>
        </template>

        <div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('pretitle-label') }}</UiFormLabel>
            <SfInput
              v-model="banner.content.text.pretitle"
              name="preTitle"
              type="text"
              :placeholder="getEditorTranslation('pretitle-placeholder')"
              data-testid="banner-input-pre-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('main-title-label') }}</UiFormLabel>
            <SfInput
              v-model="banner.content.text.title"
              name="mainTitle"
              type="text"
              :placeholder="getEditorTranslation('main-title-placeholder')"
              data-testid="banner-input-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('subtitle-label') }}</UiFormLabel>
            <SfInput
              v-model="banner.content.text.subtitle"
              name="subtitle"
              type="text"
              :placeholder="getEditorTranslation('subtitle-placeholder')"
              data-testid="banner-input-sub-title"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('description-label') }}</UiFormLabel>
            <SfTextarea
              v-model="banner.content.text.htmlDescription"
              name="description"
              data-testid="banner-text-content"
              type="text"
              class="w-full min-h-[232px]"
              :placeholder="getEditorTranslation('description-placeholder')"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('text-color-label') }}</UiFormLabel>
            <EditorColorPicker v-model="banner.content.text.color" class="w-full">
              <template #trigger="{ color, toggle }">
                <SfInput v-model="banner.content.text.color" type="text">
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
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-background-label') }}</UiFormLabel>
            <SfSwitch
              v-model="banner.content.text.background"
              class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
            />
          </div>
          <div v-if="banner.content.text.background" class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-color-label') }}</UiFormLabel>
            <EditorColorPicker v-model="banner.content.text.bgcolor!" class="w-full">
              <template #trigger="{ color, toggle }">
                <SfInput v-model="banner.content.text.bgcolor" type="text">
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
          <div v-if="banner.content.text.background" class="mb-6">
            <label class="block text-sm font-medium mb-4">{{ getEditorTranslation('textbox-opacity-label') }}</label>
            <div class="flex items-center gap-4">
              <div class="flex-1 space-y-1">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  v-model.number="banner.content.text.bgopacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  v-model.number="banner.content.text.bgopacity"
                  type="number"
                  min="0"
                  max="1"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'text')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <EditorOptionsTabs
              v-model="textboxAlignXModel"
              :legend="getEditorTranslation('textbox-align-x-label')"
              test-id-prefix="slider-textbox-align-x"
              :options="textboxAlignXOptions"
            />
          </div>

          <div class="mb-6">
            <EditorOptionsTabs
              v-model="textboxAlignYModel"
              :legend="getEditorTranslation('textbox-align-y-label')"
              test-id-prefix="slider-textbox-align-y"
              :options="textboxAlignYOptions"
            />
          </div>

          <div class="mb-6">
            <EditorOptionsTabs
              v-model="textAlignModel"
              :legend="getEditorTranslation('text-align-label')"
              test-id-prefix="slider-text-align"
              :options="textAlignOptions"
            />
          </div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="buttonOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2 data-testid="slider-button-group-title">{{ getEditorTranslation('button-group-label') }}</h2>
        </template>

        <div class="images">
          <div class="mb-6 mt-4">
            <label>
              <UiFormLabel class="mb-1">{{ getEditorTranslation('button-text-label') }}</UiFormLabel>
              <SfInput
                v-model="banner.content.button.label"
                data-testid="slider-button-label"
                name="label"
                type="text"
                :placeholder="getEditorTranslation('button-text-placeholder')"
              />
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('button-link-label') }}</UiFormLabel>
            <SfInput
              v-model="banner.content.button.link"
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
        </div>
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import { SfTextarea, SfInput, SfSwitch } from '@storefront-ui/vue';
import type { BannerFormProps, BannerProps, ButtonVariant, TextAlignX, TextAlignY } from './types';

const { blockUuid } = useSiteConfiguration();
const { activeSlideIndex } = useCarousel();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();
const { placeholderImg, labels, imageDimensions, imageTypes, deleteImage } = usePickerHelper();

const props = defineProps<BannerFormProps>();

const activeSlide = computed(() => activeSlideIndex.value[props.uuid || blockUuid.value]);
const banner = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as BannerProps,
);

const imagesOpen = ref(true);
const textOpen = ref(true);
const buttonOpen = ref(true);

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);

  if (type === 'image') {
    banner.value.content.image.brightness = clamp(nextValue, 0, 1);
  }
  if (type === 'text') {
    banner.value.content.text.bgopacity = clamp(nextValue, 0, 1);
  }
};

const handleImageAddBanner = ({ image, type }: { image: string; type: string }) => {
  const { handleImageAdd } = useImageAdd(banner.value?.content?.image);
  handleImageAdd({ image, type });
};
const textboxAlignXOptions = computed(
  (): Array<{ value: TextAlignX; label: string; testId: string }> => [
    {
      value: 'left',
      label: getEditorTranslation('textbox-align-x-left-label'),
      testId: 'slider-textbox-align-x-left',
    },
    {
      value: 'center',
      label: getEditorTranslation('textbox-align-x-center-label'),
      testId: 'slider-textbox-align-x-center',
    },
    {
      value: 'right',
      label: getEditorTranslation('textbox-align-x-right-label'),
      testId: 'slider-textbox-align-x-right',
    },
  ],
);
const textboxAlignYOptions = computed(
  (): Array<{ value: TextAlignY; label: string; testId: string }> => [
    {
      value: 'top',
      label: getEditorTranslation('textbox-align-y-top-label'),
      testId: 'slider-textbox-align-y-top',
    },
    {
      value: 'center',
      label: getEditorTranslation('textbox-align-y-center-label'),
      testId: 'slider-textbox-align-y-center',
    },
    {
      value: 'bottom',
      label: getEditorTranslation('textbox-align-y-bottom-label'),
      testId: 'slider-textbox-align-y-bottom',
    },
  ],
);
const textAlignOptions = computed(
  (): Array<{ value: TextAlignX; label: string; testId: string }> => [
    {
      value: 'left',
      label: getEditorTranslation('text-align-option-left-label'),
      testId: 'slider-text-align-left',
    },
    {
      value: 'center',
      label: getEditorTranslation('text-align-option-center-label'),
      testId: 'slider-text-align-center',
    },
    {
      value: 'right',
      label: getEditorTranslation('text-align-option-right-label'),
      testId: 'slider-text-align-right',
    },
  ],
);
const buttonVariantOptions = computed(
  (): Array<{ value: ButtonVariant; label: string; testId: string }> => [
    {
      value: 'primary',
      label: getEditorTranslation('button-variant-primary-label'),
      testId: 'slider-button-primary',
    },
    {
      value: 'secondary',
      label: getEditorTranslation('button-variant-secondary-label'),
      testId: 'slider-button-secondary',
    },
  ],
);
const buttonVariantModel = computed<ButtonVariant>({
  get: () => (banner.value.content.button.variant as ButtonVariant | undefined) ?? 'primary',
  set: (v) => {
    banner.value.content.button.variant = v;
  },
});

const textboxAlignXModel = computed<TextAlignX>({
  get: () => (banner.value.content.text.align as TextAlignX | undefined) ?? 'left',
  set: (v) => {
    banner.value.content.text.align = v;
  },
});

const textboxAlignYModel = computed<TextAlignY>({
  get: () => (banner.value.content.text.justify as TextAlignY | undefined) ?? 'top',
  set: (v) => {
    banner.value.content.text.justify = v;
  },
});

const textAlignModel = computed<TextAlignX>({
  get: () => (banner.value.content.text.textAlignment as TextAlignX | undefined) ?? 'left',
  set: (v) => {
    banner.value.content.text.textAlignment = v;
  },
});
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  appearance: textfield;
  -moz-appearance: textfield;
}
</style>

<i18n lang="json">
{
  "en": {
    "images-group-label": "Images",

    "image-xl-label": "Image XL (Desktop)",
    "image-l-label": "Image L (Desktop)",
    "image-m-label": "Image M (Tablet)",
    "image-s-label": "Image S (Mobile)",
    "image-url-placeholder": "Enter URL of image",
    "image-xl-hint": "Recommended dimensions: 1920 × 1080 px",
    "image-l-hint": "Recommended dimensions: 1024 × 576 px",
    "image-m-hint": "Recommended dimensions: 768 × 432 px",
    "image-s-hint": "Recommended dimensions: 320 × 320 px",

    "brightness-label": "Brightness",
    "alt-label": "Alt",
    "alt-hint": "Alternative image text",

    "text-group-label": "Text",
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

    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-text-placeholder": "Button",
    "button-link-label": "Link Target",
    "button-link-placeholder": "Enter URL here",
    "button-variant-label": "Variant",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary"
  },
  "de": {
    "images-group-label": "Images",

    "image-xl-label": "Image XL (Desktop)",
    "image-l-label": "Image L (Desktop)",
    "image-m-label": "Image M (Tablet)",
    "image-s-label": "Image S (Mobile)",
    "image-url-placeholder": "Enter URL of image",
    "image-xl-hint": "Recommended dimensions: 1920 × 1080 px",
    "image-l-hint": "Recommended dimensions: 1024 × 576 px",
    "image-m-hint": "Recommended dimensions: 768 × 432 px",
    "image-s-hint": "Recommended dimensions: 320 × 320 px",

    "brightness-label": "Brightness",
    "alt-label": "Alt",
    "alt-hint": "Alternative image text",

    "text-group-label": "Text",
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

    "button-group-label": "Button",
    "button-text-label": "Label",
    "button-text-placeholder": "Button",
    "button-link-label": "Link Target",
    "button-link-placeholder": "Enter URL here",
    "button-variant-label": "Variant",
    "button-variant-primary-label": "Primary",
    "button-variant-secondary-label": "Secondary"
  }
}
</i18n>
