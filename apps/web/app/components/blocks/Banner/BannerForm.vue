<template>
  <div class="block-slider-edit">
    <div :data-testid="`slide-settings-${activeSlide}`">
      <EditorFormPanel
        v-model="imagesOpen"
        :title="getEditorTranslation('images-group-label')"
        data-testid="slider-image-group-title"
      >
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
          <label for="banner-brightness" class="block text-sm font-medium mb-4">Brightness</label>
          <div class="flex items-center gap-4">
            <div class="flex-1 space-y-1">
              <div class="flex justify-between text-xs text-gray-500">
                <span>0%</span>
                <span>100%</span>
              </div>
              <input
                id="banner-brightness"
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
                id="banner-brightness-number"
                v-model.number="banner.content.image.brightness"
                type="number"
                min="0"
                max="1"
                class="w-20 px-2 py-1 border rounded text-color-red-500"
                aria-label="Brightness value"
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
      </EditorFormPanel>

      <EditorFormPanel
        v-model="textOpen"
        :title="getEditorTranslation('text-group-label')"
        data-testid="slider-text-group-title"
      >
        <div>
          <EditorRichTextEditorForm
            :model-value="banner.content.text.htmlDescription ?? ''"
            :text-align="banner.content.text.textAlignment"
            @update:model-value="banner.content.text.htmlDescription = $event"
          />
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
            <label for="banner-opacity" class="block text-sm font-medium mb-4">
              {{ getEditorTranslation('textbox-opacity-label') }}
            </label>
            <div class="flex items-center gap-4">
              <div class="flex-1 space-y-1">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  id="banner-opacity"
                  v-model.number="banner.content.text.bgopacity"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  class="w-full"
                  aria-label="Opacity slider"
                />
              </div>

              <div class="relative">
                <input
                  id="banner-opacity-number"
                  v-model.number="banner.content.text.bgopacity"
                  type="number"
                  min="0"
                  max="1"
                  aria-label="Opacity value"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'text')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <EditorOptionsTabs
              v-model="textboxAlignXModel"
              :legend="getEditorTranslation('textbox-align-main-label')"
              test-id-prefix="slider-textbox-align-x"
              :options="textboxAlignXOptions"
            />
          </div>

          <div class="mb-6">
            <EditorOptionsTabs
              v-model="textboxAlignYModel"
              :legend="getEditorTranslation('textbox-align-cross-label')"
              test-id-prefix="slider-textbox-align-y"
              :options="textboxAlignYOptions"
            />
          </div>
        </div>
      </EditorFormPanel>

      <EditorFormPanel
        v-model="buttonOpen"
        :title="getEditorTranslation('button-group-label')"
        data-testid="slider-button-group-title"
      >
        <div class="images">
          <div class="mb-6 mt-4">
            <UiFormLabel for="banner-button-label" class="mb-1">{{
              getEditorTranslation('button-text-label')
            }}</UiFormLabel>
            <SfInput
              id="banner-button-label"
              v-model="banner.content.button.label"
              data-testid="slider-button-label"
              name="label"
              type="text"
              :placeholder="getEditorTranslation('button-text-placeholder')"
            />
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import { SfInput, SfSwitch } from '@storefront-ui/vue';
import type { BannerFormProps, BannerProps } from './types';

const { blockUuid } = useSiteConfiguration();
const { activeSlideIndex } = useCarousel();
const { allBlocks: data } = useBlocks();
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
const {
  textboxAlignXModel,
  textboxAlignXOptions,
  textboxAlignYModel,
  textboxAlignYOptions,
  buttonVariantModel,
  buttonVariantOptions,
  buttonAlignModel,
  buttonAlignOptions,
} = useEditorOptionsTabs(() => banner.value.content as EditorTarget, getEditorTranslation);
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

    "text-group-label": "Text",
    "textbox-background-label": "Textbox Background",
    "textbox-color-label": "Textbox Colour",
    "textbox-opacity-label": "Textbox Opacity",

    "textbox-align-main-label": "Textbox Alignment (main axis)",
    "textbox-align-main-top-label": "Top",
    "textbox-align-main-center-label": "Center",
    "textbox-align-main-bottom-label": "Bottom",

    "textbox-align-cross-label": "Textbox Alignment (cross axis)",
    "textbox-align-cross-left-label": "Left",
    "textbox-align-cross-center-label": "Center",
    "textbox-align-cross-right-label": "Right",

    "button-align-label": "Button Alignment (x)",
    "button-align-option-left-label": "Left",
    "button-align-option-center-label": "Center",
    "button-align-option-right-label": "Right",

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

    "text-group-label": "Text",
    "textbox-background-label": "Textbox Background",
    "textbox-color-label": "Textbox Colour",
    "textbox-opacity-label": "Textbox Opacity",

    "textbox-align-main-label": "Textbox Alignment (main axis)",
    "textbox-align-main-top-label": "Top",
    "textbox-align-main-center-label": "Center",
    "textbox-align-main-bottom-label": "Bottom",

    "textbox-align-cross-label": "Textbox Alignment (cross axis)",
    "textbox-align-cross-left-label": "Left",
    "textbox-align-cross-center-label": "Center",
    "textbox-align-cross-right-label": "Right",

    "button-align-label": "Button Alignment (x)",
    "button-align-option-left-label": "Left",
    "button-align-option-center-label": "Center",
    "button-align-option-right-label": "Right",

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
