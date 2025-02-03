<template>
  <form class="space-y-4 absolute bg-white border border-gray-800 shadow-md p-4" style="z-index: 100">
    <div>
      <label for="title" class="block text-sm font-medium text-gray-700">Title</label>
      <input
        type="text"
        id="title"
        v-model="title"
        name="title"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label for="subtitle" class="block text-sm font-medium text-gray-700">Subtitle</label>
      <input
        type="text"
        id="subtitle"
        v-model="subtitle"
        name="subtitle"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label for="image-desktop" class="block text-sm font-medium text-gray-700">Image (Desktop)</label>
      <input
        type="text"
        id="image-desktop"
        v-model="imageDesktop"
        name="image-desktop"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label for="image-tablet" class="block text-sm font-medium text-gray-700">Image (Tablet)</label>
      <input
        type="text"
        id="image-tablet"
        v-model="imageTablet"
        name="image-tablet"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label for="image-mobile" class="block text-sm font-medium text-gray-700">Image (Mobile)</label>
      <input
        type="text"
        id="image-mobile"
        v-model="imageMobile"
        name="image-mobile"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label for="button-label" class="block text-sm font-medium text-gray-700">Button Label</label>
      <input
        type="text"
        id="button-label"
        v-model="buttonLabel"
        name="button-label"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label for="button-link" class="block text-sm font-medium text-gray-700">Button Link</label>
      <input
        type="text"
        id="button-link"
        v-model="buttonLink"
        name="button-link"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <div>
      <label for="html-description" class="block text-sm font-medium text-gray-700">HTML Description</label>
      <textarea
        id="html-description"
        v-model="htmlDescription"
        name="html-description"
        rows="3"
        class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
    <fieldset>
      <legend class="text-sm font-medium text-gray-700">Text Align</legend>
      <div class="mt-2 space-y-2">
        <div class="flex items-center">
          <input
            id="align-left"
            name="text-align"
            type="radio"
            value="left"
            v-model="textAlign"
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          />
          <label for="align-left" class="ml-3 block text-sm font-medium text-gray-700">Left</label>
        </div>
        <div class="flex items-center">
          <input
            id="align-center"
            name="text-align"
            type="radio"
            value="center"
            v-model="textAlign"
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          />
          <label for="align-center" class="ml-3 block text-sm font-medium text-gray-700">Center</label>
        </div>
        <div class="flex items-center">
          <input
            id="align-right"
            name="text-align"
            type="radio"
            value="right"
            v-model="textAlign"
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
          />
          <label for="align-right" class="ml-3 block text-sm font-medium text-gray-700">Right</label>
        </div>
      </div>
    </fieldset>
  </form>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ImageTextProps } from './types';

const { data } = useHomepage();
const uiImageTextBlock = ref(data.value.blocks.find((block) => block.name === 'UiImageText'));

const settings = uiImageTextBlock.value?.options as ImageTextProps;

const title = ref(settings.text?.title);
const subtitle = ref(settings.text?.subtitle);
const buttonLabel = ref(settings.button?.label);
const buttonLink = ref(settings.button?.link);
const imageDesktop = ref(settings.image?.desktop);
const imageTablet = ref(settings.image?.tablet);
const imageMobile = ref(settings.image?.mobile);
const htmlDescription = ref(settings.text?.htmlDescription);
const textAlign = ref(settings.text?.textAlignment);

watch(
  [title, subtitle, buttonLabel, buttonLink, imageDesktop, imageTablet, imageMobile, htmlDescription, textAlign],
  ([
    newTitle,
    newSubtitle,
    newButtonLabel,
    newButtonLink,
    newImageDesktop,
    newImageTablet,
    newImageMobile,
    newHtmlDescription,
    newTextAlign,
  ]) => {
    if (settings && settings.text && settings.button && settings.image) {
      settings.text.title = newTitle;
      settings.text.subtitle = newSubtitle;
      settings.button.label = newButtonLabel;
      settings.button.link = newButtonLink;
      settings.image.desktop = newImageDesktop;
      settings.image.tablet = newImageTablet;
      settings.image.mobile = newImageMobile;
      settings.text.htmlDescription = newHtmlDescription;
      settings.text.textAlignment = newTextAlign;
    }
  },
  { deep: true },
);
</script>
