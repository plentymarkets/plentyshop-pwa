<template>
  <div class="site-settings-view sticky top-[52px] p-4">
    <div class="mb-6">
      <div class="flex item-center justify-between mb-4">
        <h2>Slides</h2>
        <div class="flex item-center">
          <button @click="addSlide" class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0">
            <SfIconAdd class="text-neutral-500" />
          </button>
          <div class="relative">
            <button
              @click="showSlidesDropdown = !showSlidesDropdown"
              class="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <SfIconMoreHoriz class="text-neutral-500" />
            </button>

            <div v-if="showSlidesDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              <div class="p-2">
                <div
                  v-for="(_, index) in slides"
                  :key="index"
                  class="flex items-center justify-between hover:bg-gray-100 p-2 rounded"
                >
                  <span>Slide {{ index + 1 }}</span>
                  <button
                    @click="deleteSlide(index)"
                    class="text-red-500 hover:text-red-700"
                    :disabled="slides.length === 1"
                  >
                    <SfIconDelete class="text-neutral-500" />
                  </button>
                </div>
                <button @click="addSlide" class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0">
                  <SfIconAdd class="text-neutral-500" />
                </button>
              </div>
            </div>


          </div>
        </div>
      </div>
      <SfScrollable
        class="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <template #previousButton="defaultProps">
          <button
            v-bind="defaultProps"
            class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SfIconChevronLeft class="text-neutral-500" />
          </button>
        </template>

        <template #nextButton="defaultProps">
          <button
            v-bind="defaultProps"
            class="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SfIconChevronRight class="text-neutral-500" />
          </button>
        </template>

        <div class="flex items-center gap-2 flex-nowrap">
          <button
            v-for="(_, index) in slides"
            :key="index"
            @click="activeSlide = index"
            class="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 shrink-0"
            :class="activeSlide === index ? 'bg-primary-500 text-white' : ''"
          >
            Slide {{ index + 1 }}
          </button>
        </div>
      </SfScrollable>
    </div>

    <div>
      <UiAccordionItem
        v-model="imagesOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Images</h2>
        </template>

        <div class="images">
          <div class="mb-6 mt-4">
            <label>
              <UiFormLabel class="mb-1">Desktop Image</UiFormLabel>
              <SfInput v-model="slides[activeSlide].image.desktop" name="desktopImage" type="text" />
              <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
                Recommended dimensions: 768x432 px
              </div>
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Tablet Image</UiFormLabel>
            <SfInput v-model="slides[activeSlide].image.tablet" name="desktopImage" type="text" />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
              Recommended dimensions: 768x432 px
            </div>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Mobile Image</UiFormLabel>
            <SfInput v-model="slides[activeSlide].image.mobile" name="desktopImage" type="text" />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
              Recommended dimensions: 320x320 px
            </div>
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
                  type="range"
                  v-model.number="slides[activeSlide].image.brightness"
                  min="0"
                  max="100"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  type="number"
                  v-model.number="slides[activeSlide].image.brightness"
                  min="0"
                  max="100"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'image')"
                />
                <span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Alt</UiFormLabel>
            <SfInput v-model="slides[activeSlide].image.alt" name="alt" type="text" />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
              Alternative image text
            </div>
          </div>
        </div>
      </UiAccordionItem>

      <UiAccordionItem
        v-model="textOpen"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>Text</h2>
        </template>

        <div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Pre Title</UiFormLabel>
            <SfInput v-model="slides[activeSlide].text.pretitle" name="preTitle" type="text" />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Main Title</UiFormLabel>
            <SfInput v-model="slides[activeSlide].text.title" name="mainTitle" type="text" />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Sub Title</UiFormLabel>
            <SfInput v-model="slides[activeSlide].text.subtitle" name="subtitle" type="text" />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Description</UiFormLabel>
            <SfTextarea
              v-model="slides[activeSlide].text.htmlDescription"
              name="description"
              type="text"
              class="w-full"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Color</UiFormLabel>

            <SfInput v-model="slides[activeSlide].text.color" type="text">
              <template #suffix>
                <label for="primary-color" :style="{ backgroundColor: slides[activeSlide].text.color }" class="rounded-lg cursor-pointer">
                  <input id="primary-color" v-model="slides[activeSlide].text.color" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Bg Color</UiFormLabel>

            <SfInput v-model="slides[activeSlide].text.bgcolor" type="text">
              <template #suffix>
                <label for="primary-color" :style="{ backgroundColor: slides[activeSlide].text.bgcolor }" class="rounded-lg cursor-pointer">
                  <input id="primary-color" v-model="slides[activeSlide].text.bgcolor" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
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
                    type="range"
                    v-model.number="slides[activeSlide].text.bgopacity"
                    min="0"
                    max="100"
                    class="w-full"
                />
              </div>

              <div class="relative">
                <input
                    type="number"
                    v-model.number="slides[activeSlide].text.bgopacity"
                    min="0"
                    max="100"
                    class="w-20 px-2 py-1 border rounded text-color-red-500"
                    @input="clampBrightness($event, 'text')"
                />
                <span class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">%</span>
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Text Alignment</UiFormLabel>

            <Multiselect
                v-model="slides[activeSlide].text.textAlignment"
                :options="['left', 'center', 'right']"
                placeholder="Select an alignment"
                :allow-empty="false"
                class="cursor-pointer"
                select-label=""
                deselect-label="Selected"
            />
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Justify</UiFormLabel>

            <Multiselect
                v-model="slides[activeSlide].text.justify"
                :options="['start', 'center', 'end']"
                placeholder="Select justify"
                :allow-empty="false"
                class="cursor-pointer"
                select-label=""
                deselect-label="Selected"
            />
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Align</UiFormLabel>

            <Multiselect
                v-model="slides[activeSlide].text.align"
                :options="['start', 'center', 'end']"
                placeholder="Select align"
                :allow-empty="false"
                class="cursor-pointer"
                select-label=""
                deselect-label="Selected"
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
          <h2>Button</h2>
        </template>

        <div class="images">
          <div class="mb-6 mt-4">
            <label>
              <UiFormLabel class="mb-1">Label</UiFormLabel>
              <SfInput v-model="slides[activeSlide].button.label" name="label" type="text" />
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Link</UiFormLabel>
            <SfInput v-model="slides[activeSlide].button.link" name="link" type="text" />
          </div>
          <div class="mb-6">
            <Multiselect
                v-model="slides[activeSlide].button.variant"
                :options="['primary', 'secondary']"
                placeholder="Select variant"
                :allow-empty="false"
                class="cursor-pointer"
                select-label=""
                deselect-label="Selected"
            />
          </div>
        </div>
      </UiAccordionItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { clamp } from '@storefront-ui/shared';
import {
  SfTextarea,
  SfScrollable,
  SfIconChevronLeft,
  SfIconChevronRight,
  SfIconDelete,
  SfInput,
  SfIconMoreHoriz,
  SfIconAdd,
} from '@storefront-ui/vue';
import { BannerProps, Slide } from '~/components/ui/Banner/types';
import { BannerSlide } from '~/composables/useHomepage/types';
import Multiselect from "vue-multiselect";

const { data, updateBannerItems } = useHomepage();
const sliderBlock = computed(
  () => (data.value.blocks.find((block: Block) => block.name === 'UiCarousel')?.options || {}) as BannerSlide,
);

const slides = computed({
  get: () => {
    return sliderBlock.value?.bannerItems || [];
  },
  set: (value) => updateBannerItems(value),
});

const activeSlide = ref(0);
const showSlidesDropdown = ref(false);
const imagesOpen = ref(true);
const textOpen = ref(true);
const buttonOpen = ref(true);

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);

  if (type === 'image') {
    slides.value[activeSlide.value].image.brightness = clamp(nextValue, 0, 100);
  }
  if (type === 'text') {
    slides.value[activeSlide.value].text.bgopacity = clamp(nextValue, 0, 100);
  }
};

const addSlide = () => {
  const newSlide: Slide = {
    image: {
      desktop: '',
      tablet: '',
      mobile: '',
      brightness: 50,
      alt: '',
    },
    text: {
      pretitle: '',
      title: '',
      subtitle: '',
      htmlDescription: '',
      color: '#000',
      bgcolor: '#fff',
      bgopacity: 0.9,
      textAlignment: 'left',
      justify: 'center',
      align: 'center',
    },
    button: {
      label: 'Discover',
      link: '/',
      variant: 'primary',
    },
  };

  slides.value = [...slides.value, newSlide];
  activeSlide.value = slides.value.length - 1;
};

const deleteSlide = (index: number) => {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((_: BannerProps, i: number) => i !== index);
  activeSlide.value = Math.min(activeSlide.value, slides.value.length - 1);
};
</script>

<style scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
