<template>
  <form class="w-full space-y-4 absolute bg-white">
    <!-- Image Group -->
    <UiAccordionItem
      v-model="imageGroupOpen"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Images</h2>
      </template>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Desktop Image</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.image.desktop" type="text">
            <template #suffix>
              <label for="image-tablet" class="rounded-lg cursor-pointer">
                <input id="image-tablet" v-model="uiImageTextBlock.image.desktop" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
          <span class="typography-text-xs text-neutral-700">Recommended dimensions 1024x576 px</span>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Tablet Image</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.image.tablet" type="text">
            <template #suffix>
              <label for="image-tablet" class="rounded-lg cursor-pointer">
                <input id="image-tablet" v-model="uiImageTextBlock.image.tablet" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
          <span class="typography-text-xs text-neutral-700">Recommended dimensions 1024x576 px</span>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Mobile Image</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.image.mobile" type="text">
            <template #suffix>
              <label for="image-mobile" class="rounded-lg cursor-pointer">
                <input id="image-mobile" v-model="uiImageTextBlock.image.mobile" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
          <span class="typography-text-xs text-neutral-700">Recommended dimensions 1024x576 px</span>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Alt</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.image.alt" type="text">
            <template #suffix>
              <label for="alt" class="rounded-lg cursor-pointer">
                <input id="alt" v-model="uiImageTextBlock.image.alt" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>
      <fieldset class="py-2">
        <UiFormLabel>Image Align</UiFormLabel>

        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <SfRadio
            v-model="uiImageTextBlock.image.imageAlignment"
            id="align-left"
            name="image-align"
            value="left"
            class="hidden"
          />
          <label
            for="align-left"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.image.imageAlignment === 'left' }"
            @click="uiImageTextBlock.image.imageAlignment = 'left'"
          >
            <SfIconCheck v-if="uiImageTextBlock.image.imageAlignment === 'left'" class="mr-1 w-[1.1rem]" />
            Left
          </label>

          <SfRadio
            v-model="uiImageTextBlock.image.imageAlignment"
            id="align-right"
            name="image-align"
            value="right"
            class="hidden"
          />
          <label
            for="align-right"
            class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.image.imageAlignment === 'right' }"
            @click="uiImageTextBlock.image.imageAlignment = 'right'"
          >
            <SfIconCheck v-if="uiImageTextBlock.image.imageAlignment === 'right'" class="mr-1 w-[1.1rem]" />
            Right
          </label>
        </div>
      </fieldset>
    </UiAccordionItem>
    <!-- End Image Group -->

    <!-- Text Group -->
    <UiAccordionItem
      v-model="textGroup"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Text</h2>
      </template>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Pre title</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.text.pretitle" type="text">
            <template #suffix>
              <label for="pretitle" class="rounded-lg cursor-pointer">
                <input id="pretitle" v-model="uiImageTextBlock.text.pretitle" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Title</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.text.title" type="text">
            <template #suffix>
              <label for="title" class="rounded-lg cursor-pointer">
                <input id="title" v-model="uiImageTextBlock.text.title" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Subtitle</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.text.subtitle" type="text">
            <template #suffix>
              <label for="subtitle" class="rounded-lg cursor-pointer">
                <input id="subtitle" v-model="uiImageTextBlock.text.subtitle" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <UiFormLabel>HTML Description</UiFormLabel>
        <SfTextarea
          id="html-description"
          v-model="uiImageTextBlock.text.htmlDescription"
          name="html-description"
          rows="3"
          class="min-h-[232px] mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Primary color</UiFormLabel>
          <SfTooltip
            label="The shop uses a primary and secondary color palette. Each palette consists of ten shades. The colors configured here serve as the base value for the respective palette. All other shades are automatically generated during the build process."
            :placement="'top'"
            :show-arrow="true"
            class="ml-2 z-10"
          >
            <SfIconInfo :size="'sm'" />
          </SfTooltip>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.text.color" type="text">
            <template #suffix>
              <label
                for="primary-color"
                :style="{ backgroundColor: uiImageTextBlock.text.color }"
                class="rounded-lg cursor-pointer"
              >
                <input id="primary-color" v-model="uiImageTextBlock.text.color" type="color" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
          <span class="typography-text-xs text-neutral-700">Choose primary color</span>
        </label>
      </div>

      <fieldset class="py-2">
        <legend class="text-sm font-medium text-gray-700">Text Align</legend>

        <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
          <!-- Left Align -->
          <label
            for="align-left"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textAlignment === 'left' }"
            @click="uiImageTextBlock.text.textAlignment = 'left'"
          >
            <SfRadio
              v-model="uiImageTextBlock.text.textAlignment"
              id="align-left"
              name="text-align"
              value="left"
              class="hidden"
            />
            <SfIconCheck v-if="uiImageTextBlock.text.textAlignment === 'left'" class="mr-1 w-[1.1rem]" />
            Left
          </label>

          <!-- Center Align -->
          <label
            for="align-center"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textAlignment === 'center' }"
            @click="uiImageTextBlock.text.textAlignment = 'center'"
          >
            <SfRadio
              v-model="uiImageTextBlock.text.textAlignment"
              id="align-center"
              name="text-align"
              value="center"
              class="hidden"
            />
            <SfIconCheck v-if="uiImageTextBlock.text.textAlignment === 'center'" class="mr-1 w-[1.1rem]" />
            Center
          </label>

          <!-- Right Align -->
          <label
            for="align-right"
            class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
            :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.text.textAlignment === 'right' }"
            @click="uiImageTextBlock.text.textAlignment = 'right'"
          >
            <SfRadio
              v-model="uiImageTextBlock.text.textAlignment"
              id="align-right"
              name="text-align"
              value="right"
              class="hidden"
            />
            <SfIconCheck v-if="uiImageTextBlock.text.textAlignment === 'right'" class="mr-1 w-[1.1rem]" />
            Right
          </label>
        </div>
      </fieldset>
    </UiAccordionItem>
    <!-- End Text Group -->

    <!-- Button Group -->

    <UiAccordionItem
      v-model="buttonGroup"
      summary-active-class="bg-neutral-100 border-t-0"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>Button</h2>
      </template>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Button Label</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.button.label" type="text">
            <template #suffix>
              <label for="button-label" class="rounded-lg cursor-pointer">
                <input id="button-label" v-model="uiImageTextBlock.button.label" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <div class="py-2">
        <div class="flex justify-between mb-2">
          <UiFormLabel>Button Link</UiFormLabel>
        </div>
        <label>
          <SfInput v-model="uiImageTextBlock.button.link" type="text">
            <template #suffix>
              <label for="button-link" class="rounded-lg cursor-pointer">
                <input id="button-link" v-model="uiImageTextBlock.button.link" type="text" class="invisible w-8" />
              </label>
            </template>
          </SfInput>
        </label>
      </div>

      <fieldset>
        <legend class="text-sm font-medium text-gray-700">Outline</legend>
        <div class="mt-2 space-y-2">
          <div class="flex items-center">
            <SfInput
              id="align-left"
              name="text-align"
              type="radio"
              value="on"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label for="align-left" class="ml-3 block text-sm font-medium text-gray-700">On</label>
          </div>

          <div class="flex items-center">
            <SfInput
              id="align-right"
              name="text-align"
              type="radio"
              value="off"
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
            />
            <label for="align-right" class="ml-3 block text-sm font-medium text-gray-700">Off</label>
          </div>
        </div>
      </fieldset>
    </UiAccordionItem>
    <!-- EndButton Group -->
  </form>
</template>

<script setup lang="ts">
import type { ImageTextProps2 } from './types';
import { SfTooltip, SfInput, SfTextarea, SfRadio, SfIconCheck } from '@storefront-ui/vue';
const { data } = useHomepage();

const imageGroupOpen = ref(false);
const buttonGroup = ref(false);
const textGroup = ref(false);

const uiImageTextBlock = computed(
  () => data.value.blocks.find((block) => block.name === 'UiImageText')?.options as ImageTextProps2,
);
</script>
