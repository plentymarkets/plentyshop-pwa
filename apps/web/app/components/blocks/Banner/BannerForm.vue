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
            <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-align-x-label') }}</UiFormLabel>

            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="textbox-align-left"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'left',
                }"
                data-testid="slider-textbox-y-align-left"
                @click="banner.content.text.align = 'left'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'left' }" />
                {{ getEditorTranslation('textbox-align-x-left-label') }}
              </div>

              <div
                for="textbox-align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'center',
                }"
                data-testid="slider-textbox-y-align-center"
                @click="banner.content.text.align = 'center'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'center' }" />
                {{ getEditorTranslation('textbox-align-x-center-label') }}
              </div>

              <div
                for="textbox-align-right"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.align === 'right',
                }"
                data-testid="slider-textbox-y-align-right"
                @click="banner.content.text.align = 'right'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.align !== 'right' }" />
                {{ getEditorTranslation('textbox-align-x-right-label') }}
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('textbox-align-y-label') }}</UiFormLabel>

            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="align-top"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'top',
                }"
                data-testid="slider-textbox-align-top"
                @click="banner.content.text.justify = 'top'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'top' }" />
                {{ getEditorTranslation('textbox-align-y-top-label') }}
              </div>

              <div
                for="align-center"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'center',
                }"
                data-testid="slider-textbox-align-center"
                @click="banner.content.text.justify = 'center'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'center' }" />
                {{ getEditorTranslation('textbox-align-y-center-label') }}
              </div>

              <div
                for="align-bottom"
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.text.justify === 'bottom',
                }"
                data-testid="slider-textbox-align-bottom"
                @click="banner.content.text.justify = 'bottom'"
              >
                <SfIconCheck class="mr-1 w-[1.1rem]" :class="{ invisible: banner.content.text.justify !== 'bottom' }" />
                {{ getEditorTranslation('textbox-align-y-bottom-label') }}
              </div>
            </div>
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
            <UiFormLabel class="mb-1">{{ getEditorTranslation('button-variant-label') }}</UiFormLabel>
            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.variant === 'primary',
                }"
                data-testid="slider-button-primary"
                @click="banner.content.button.variant = 'primary'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.variant !== 'primary' }"
                />
                {{ getEditorTranslation('button-variant-primary-label') }}
              </div>

              <div
                class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.variant === 'secondary',
                }"
                data-testid="slider-button-secondary"
                @click="banner.content.button.variant = 'secondary'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.variant !== 'secondary' }"
                />
                {{ getEditorTranslation('button-variant-secondary-label') }}
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">{{ getEditorTranslation('button-align-label') }}</UiFormLabel>
            <div
              class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden"
            >
              <div
                for="button-align-left"
                class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.alignment === 'left',
                }"
                data-testid="slider-button-align-left"
                @click="banner.content.button.alignment = 'left'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.alignment !== 'left' }"
                />
                {{ getEditorTranslation('button-align-option-left-label') }}
              </div>

              <div
                for="button-align-center"
                class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.alignment === 'center',
                }"
                data-testid="slider-button-align-center"
                @click="banner.content.button.alignment = 'center'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.alignment !== 'center' }"
                />
                {{ getEditorTranslation('button-align-option-center-label') }}
              </div>

              <div
                for="button-align-right"
                class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
                :class="{
                  'bg-gray-100 text-gray-900 font-semibold': banner.content.button.alignment === 'right',
                }"
                data-testid="slider-button-align-right"
                @click="banner.content.button.alignment = 'right'"
              >
                <SfIconCheck
                  class="mr-1 w-[1.1rem]"
                  :class="{ invisible: banner.content.button.alignment !== 'right' }"
                />
                {{ getEditorTranslation('button-align-option-right-label') }}
              </div>
            </div>
          </div>
        </div>
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import { SfInput, SfIconCheck, SfSwitch } from '@storefront-ui/vue';
import type { BannerFormProps, BannerProps } from './types';

const { blockUuid } = useSiteConfiguration();
const { activeSlideIndex } = useCarousel();
const route = useRoute();
const { data } = useBlockTemplates(
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

    "textbox-align-x-label": "Textbox Alignment (x)",
    "textbox-align-x-left-label": "Left",
    "textbox-align-x-center-label": "Center",
    "textbox-align-x-right-label": "Right",

    "textbox-align-y-label": "Textbox Alignment (y)",
    "textbox-align-y-top-label": "Top",
    "textbox-align-y-center-label": "Center",
    "textbox-align-y-bottom-label": "Bottom",

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

    "textbox-align-x-label": "Textbox Alignment (x)",
    "textbox-align-x-left-label": "Left",
    "textbox-align-x-center-label": "Center",
    "textbox-align-x-right-label": "Right",

    "textbox-align-y-label": "Textbox Alignment (y)",
    "textbox-align-y-top-label": "Top",
    "textbox-align-y-center-label": "Center",
    "textbox-align-y-bottom-label": "Bottom",

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
