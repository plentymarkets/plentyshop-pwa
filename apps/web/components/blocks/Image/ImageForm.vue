<template>
  <UiAccordionItem
    v-model="imageGroupOpen"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="image-group"
  >
    <template #summary>
      <h2>Images</h2>
    </template>

        <div v-if="runtimeConfig.public.isDev" class="images">
          <div class="mb-6 mt-4">
            <label>
              <UiFormLabel class="mb-1">Image XL (Desktop)</UiFormLabel>
              <div class="flex items-start gap-4">
                <div class="w-[120px] h-[90px] flex-shrink-0 rounded overflow-hidden border">
                  <img
                    :src="uiImageTextBlock.wideScreen || placeholderImg"
                    alt="Banner Image XL"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <template v-if="uiImageTextBlock.wideScreen !== placeholderImg">
                    <p class="text-sm text-gray-800 truncate">image_name_111.png</p>
                    <p class="text-sm text-gray-500">1920 × 1080 px</p>
                  </template>
                  <template v-else>
                    <p class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Recommended dimensions: 1920 x 1080 px</p>
                  </template>
                  <div class="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      class="bg-slate-900 text-white text-sm px-4 py-1.5 h-[40px] rounded-md hover:bg-slate-800 text-center"
                    >
                      Select
                    </button>
                    <button
                      v-if="uiImageTextBlock.wideScreen !== placeholderImg"
                      type="button"
                      class="border border-slate-900 text-slate-900 h-[40px] px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center justify-center"
                      @click="deleteImage('wideScreen')"
                    >
                      <SfIconDelete />
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="mb-6">
            <label>
              <UiFormLabel class="mb-1">Image L (Desktop)</UiFormLabel>
              <div class="flex items-start gap-4">
                <div class="w-[120px] h-[90px] flex-shrink-0 rounded overflow-hidden border">
                  <img
                    :src="uiImageTextBlock.desktop || placeholderImg"
                    alt="Banner Image L"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <template v-if="uiImageTextBlock.desktop !== placeholderImg">
                    <p class="text-sm text-gray-800 truncate">image_name_111.png</p>
                    <p class="text-sm text-gray-500">1024 x 576 px</p>
                  </template>
                  <template v-else>
                    <p class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Recommended dimensions: 1024 x 576 px</p>
                  </template>
                  <div class="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      class="bg-slate-900 text-white text-sm px-4 py-1.5 h-[40px] rounded-md hover:bg-slate-800 text-center"
                    >
                      Select
                    </button>
                    <button
                      v-if="uiImageTextBlock.desktop !== placeholderImg"
                      type="button"
                      class="border border-slate-900 text-slate-900 h-[40px] px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center justify-center"
                      @click="deleteImage('desktop')"
                    >
                      <SfIconDelete />
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="mb-6">
            <label>
              <UiFormLabel class="mb-1">Image M (Desktop)</UiFormLabel>
              <div class="flex items-start gap-4">
                <div class="w-[120px] h-[90px] flex-shrink-0 rounded overflow-hidden border">
                  <img
                    :src="uiImageTextBlock.tablet || placeholderImg"
                    alt="Banner Image M"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <template v-if="uiImageTextBlock.tablet !== placeholderImg">
                    <p class="text-sm text-gray-800 truncate">image_name_111.png</p>
                    <p class="text-sm text-gray-500">768 x 432 px</p>
                  </template>
                  <template v-else>
                    <p class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Recommended dimensions: 768 x 432 px</p>
                  </template>
                  <div class="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      class="bg-slate-900 text-white text-sm px-4 py-1.5 h-[40px] rounded-md hover:bg-slate-800 text-center"
                    >
                      Select
                    </button>
                    <button
                      v-if="uiImageTextBlock.tablet !== placeholderImg"
                      type="button"
                      class="border border-slate-900 text-slate-900 h-[40px] px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center justify-center"
                      @click="deleteImage('tablet')"
                    >
                      <SfIconDelete />
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>
          <div class="mb-6">
            <label>
              <UiFormLabel class="mb-1">Image S (Mobile)</UiFormLabel>
              <div class="flex items-start gap-4">
                <div class="w-[120px] h-[90px] flex-shrink-0 rounded overflow-hidden border">
                  <img
                    :src="uiImageTextBlock.mobile || placeholderImg"
                    alt="Banner Image S"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div class="flex-1">
                  <template v-if="uiImageTextBlock.mobile !== placeholderImg">
                    <p class="text-sm text-gray-800 truncate">image_name_111.png</p>
                    <p class="text-sm text-gray-500">320 x 320 px</p>
                  </template>
                  <template v-else>
                    <p class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Recommended dimensions: 320 x 320 px</p>
                  </template>
                  <div class="mt-3 flex items-center gap-2">
                    <button
                      type="button"
                      class="bg-slate-900 text-white text-sm px-4 py-1.5 h-[40px] rounded-md hover:bg-slate-800 text-center"
                    >
                      Select
                    </button>
                    <button
                      v-if="uiImageTextBlock.mobile !== placeholderImg"
                      type="button"
                      class="border border-slate-900 text-slate-900 h-[40px] px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center justify-center"
                      @click="deleteImage('mobile')"
                    >
                      <SfIconDelete />
                    </button>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
    <div v-else class="images">
    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Image XL (Desktop) </UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.wideScreen" type="text" data-testid="wide-screen-input">
          <template #suffix>
            <label for="image-tablet" class="rounded-lg cursor-pointer">
              <input id="image-tablet" v-model="uiImageTextBlock.wideScreen" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Recommended dimensions: 1920 x 1080 px </span>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Image L (Desktop) </UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.desktop" type="text" data-testid="large-screen-input">
          <template #suffix>
            <label for="image-tablet" class="rounded-lg cursor-pointer">
              <input id="image-tablet" v-model="uiImageTextBlock.desktop" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Recommended dimensions: 1024 x 576 px</span>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Image M (Laptop) </UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.tablet" type="text" data-testid="medium-screen-input">
          <template #suffix>
            <label for="image-tablet" class="rounded-lg cursor-pointer">
              <input id="image-tablet" v-model="uiImageTextBlock.tablet" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Recommended dimensions: 768 x 432 px</span>
      </label>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Image S (Mobile) </UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.mobile" type="text" data-testid="small-screen-input">
          <template #suffix>
            <label for="image-mobile" class="rounded-lg cursor-pointer">
              <input
                id="image-mobile"
                v-model="uiImageTextBlock.mobile"
                data-testid="small-screen-input"
                type="text"
                class="invisible w-8"
              />
            </label>
          </template>
        </SfInput>
        <span class="typography-text-xs text-neutral-700">Recommended dimensions: 320 x 320 px </span>
      </label>
    </div>
 </div>
    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>Alt</UiFormLabel>
      </div>
      <label>
        <SfInput v-model="uiImageTextBlock.alt" type="text" data-testid="alt-input">
          <template #suffix>
            <label for="alt" class="rounded-lg cursor-pointer">
              <input id="alt" v-model="uiImageTextBlock.alt" type="text" class="invisible w-8" />
            </label>
          </template>
        </SfInput>
      </label>
    </div>

    <fieldset class="py-2">
      <UiFormLabel>Image Alignment</UiFormLabel>

      <div class="mt-2 w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          for="align-left"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.imageAlignment === 'left' }"
          data-testid="image-align-left"
          @click="uiImageTextBlock.imageAlignment = 'left'"
        >
          <SfIconCheck :class="{ invisible: uiImageTextBlock.imageAlignment !== 'left' }" class="mr-1 w-[1.1rem]" />

          Left
        </div>

        <div
          for="align-right"
          class="flex items-center justify-center w-1/2 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': uiImageTextBlock.imageAlignment === 'right' }"
          data-testid="image-align-right"
          @click="uiImageTextBlock.imageAlignment = 'right'"
        >
          <SfIconCheck :class="{ invisible: uiImageTextBlock.imageAlignment !== 'right' }" class="mr-1 w-[1.1rem]" />
          Right
        </div>
      </div>
    </fieldset>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import type { ImageFormProps, ImageContent } from './types';
import { SfInput, SfIconCheck, SfIconDelete } from '@storefront-ui/vue';
const runtimeConfig = useRuntimeConfig();
const placeholderImg = 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png';

const deleteImage = (type: 'wideScreen' | 'desktop' | 'tablet' | 'mobile') => {
  uiImageTextBlock.value[type] = placeholderImg;
};
const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const props = defineProps<ImageFormProps>();

const uiImageTextBlock = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content || {}) as ImageContent,
);

const imageGroupOpen = ref(false);
</script>
