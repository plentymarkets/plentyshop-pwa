<template>
  <div class="block-slider-edit sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
    <div class="mb-6">
      <div class="flex item-center justify-between mb-4 p-4">
        <h2>Slides</h2>
        <div class="flex item-center">
          <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0" @click="addSlide">
            <SfIconAdd class="text-neutral-500" />
          </button>
          <div class="relative">
            <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-full" @click="open">
              <SfIconMoreHoriz class="text-neutral-500" />
            </button>

            <div v-if="isOpen" class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
              <div class="flex justify-end p-2">
                <SfIconClose class="cursor-pointer" @click="close" />
              </div>
              <hr />
              <div class="p-2">
                <div v-for="(_, index) in slides" :key="index" class="flex items-center justify-between p-2 rounded">
                  <div class="flex items-center">
                    <SfIconArrowUpward
                      v-if="index !== 0"
                      class="cursor-pointer text-neutral-500 mr-2"
                      size="sm"
                      @click.stop="moveSlideUp(index)"
                    />
                    <SfIconArrowUpward v-else class="cursor-pointer text-neutral-500 mr-2 invisible" size="sm" />

                    <SfIconArrowDownward
                      v-if="index + 1 !== slides.length"
                      class="cursor-pointer text-neutral-500 mr-2"
                      size="sm"
                      @click.stop="moveSlideDown(index)"
                    />
                    <SfIconArrowDownward v-else class="cursor-pointer text-neutral-500 mr-2 invisible" size="sm" />
                    <span>Slide {{ index + 1 }}</span>
                  </div>
                  <button
                    class="text-red-500 hover:text-red-700"
                    :disabled="slides.length === 1"
                    @click="deleteSlide(index)"
                  >
                    <SfIconDelete class="text-neutral-500" />
                  </button>
                </div>
                <hr />
                <div class="pl-2 pr-2 pt-2 flex justify-between items-center">
                  <p>Add Slide</p>
                  <button class="p-2 text-gray-600 hover:bg-gray-100 rounded-full shrink-0" @click="addSlide">
                    <SfIconAdd class="text-neutral-500" />
                  </button>
                </div>
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
            class="px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 shrink-0"
            :class="activeSlide === index ? 'bg-primary-500 text-white' : ''"
            @click="slideClick(index)"
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
              <SfInput
                v-model="slides[activeSlide].image.desktop"
                name="desktopImage"
                type="text"
                placeholder="Enter URL of image"
              />
              <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
                Recommended dimensions: 768x432 px
              </div>
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Tablet Image</UiFormLabel>
            <SfInput
              v-model="slides[activeSlide].image.tablet"
              name="desktopImage"
              type="text"
              placeholder="Enter URL of image"
            />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
              Recommended dimensions: 768x432 px
            </div>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Mobile Image</UiFormLabel>
            <SfInput
              v-model="slides[activeSlide].image.mobile"
              name="desktopImage"
              type="text"
              placeholder="Enter URL of image"
            />
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
                  v-model.number="slides[activeSlide].image.brightness"
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  v-model.number="slides[activeSlide].image.brightness"
                  type="number"
                  min="0.1"
                  max="1"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'image')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Alt</UiFormLabel>
            <SfInput v-model="slides[activeSlide].image.alt" name="alt" type="text" />
            <div class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">Alternative image text</div>
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
            <SfInput v-model="slides[activeSlide].text.pretitle" name="preTitle" type="text" placeholder="PreTitle" />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Main Title</UiFormLabel>
            <SfInput v-model="slides[activeSlide].text.title" name="mainTitle" type="text" placeholder="Title" />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Sub Title</UiFormLabel>
            <SfInput v-model="slides[activeSlide].text.subtitle" name="subtitle" type="text" placeholder="SubTitle" />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Description</UiFormLabel>
            <SfTextarea
              v-model="slides[activeSlide].text.htmlDescription"
              name="description"
              type="text"
              class="w-full min-h-[232px]"
              placeholder="Text that supports HTML formatting"
            />
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Text Color</UiFormLabel>

            <SfInput v-model="slides[activeSlide].text.color" type="text">
              <template #suffix>
                <label
                  for="text-color"
                  :style="{ backgroundColor: slides[activeSlide].text.color }"
                  class="rounded-lg cursor-pointer"
                >
                  <input id="text-color" v-model="slides[activeSlide].text.color" type="color" class="invisible w-8" />
                </label>
              </template>
            </SfInput>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Background</UiFormLabel>

            <SfInput v-model="slides[activeSlide].text.bgcolor" type="text">
              <template #suffix>
                <label
                  for="text-bg-color"
                  :style="{ backgroundColor: slides[activeSlide].text.bgcolor }"
                  class="rounded-lg cursor-pointer"
                >
                  <input
                    id="text-bg-color"
                    v-model="slides[activeSlide].text.bgcolor"
                    type="color"
                    class="invisible w-8"
                  />
                </label>
              </template>
            </SfInput>
          </div>
          <div class="mb-6">
            <label class="block text-sm font-medium mb-4">Textbox Opacity</label>
            <div class="flex items-center gap-4">
              <div class="flex-1 space-y-1">
                <div class="flex justify-between text-xs text-gray-500">
                  <span>0%</span>
                  <span>100%</span>
                </div>
                <input
                  v-model.number="slides[activeSlide].text.bgopacity"
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.01"
                  class="w-full"
                />
              </div>

              <div class="relative">
                <input
                  v-model.number="slides[activeSlide].text.bgopacity"
                  type="number"
                  min="0.1"
                  max="1"
                  class="w-20 px-2 py-1 border rounded text-color-red-500"
                  @input="clampBrightness($event, 'text')"
                />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Alignment (x)</UiFormLabel>

            <Multiselect
              v-model="slides[activeSlide].text.justify"
              :options="['top', 'center', 'bottom']"
              placeholder="Select justify"
              :allow-empty="false"
              class="cursor-pointer"
              select-label=""
              deselect-label="Selected"
            />
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Textbox Alignment (y)</UiFormLabel>

            <Multiselect
              v-model="slides[activeSlide].text.align"
              :options="['left', 'center', 'right']"
              placeholder="Select an alignment"
              :allow-empty="false"
              class="cursor-pointer"
              select-label=""
              deselect-label="Selected"
            />
          </div>

          <div class="mb-6">
            <UiFormLabel class="mb-1">Text Alignment (y)</UiFormLabel>

            <Multiselect
              v-model="slides[activeSlide].text.textAlignment"
              :options="['left', 'center', 'right']"
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
              <SfInput v-model="slides[activeSlide].button.label" name="label" type="text" placeholder="Button" />
            </label>
          </div>
          <div class="mb-6">
            <UiFormLabel class="mb-1">Link</UiFormLabel>
            <SfInput v-model="slides[activeSlide].button.link" name="link" type="text" placeholder="Enter URL here" />
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
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconAdd,
  useDisclosure,
  SfIconClose,
} from '@storefront-ui/vue';
import type { BannerProps, Slide } from '~/components/ui/Banner/types';
import type { BannerSlide } from '~/composables/useHomepage/types';
import Multiselect from 'vue-multiselect';

const { isOpen, open, close } = useDisclosure();
const { data, updateBannerItems, setIndex, activeIndex: activeSlide } = useHomepage();

const sliderBlock = computed(
  () => (data.value.blocks.find((block: Block) => block.name === 'UiCarousel')?.options || {}) as BannerSlide,
);

const slides = computed({
  get: () => {
    return sliderBlock.value?.bannerItems || [];
  },
  set: (value) => updateBannerItems(value),
});

const imagesOpen = ref(true);
const textOpen = ref(true);
const buttonOpen = ref(true);

const slideClick = (index: number) => {
  setIndex(index);
};

const clampBrightness = (event: Event, type: string) => {
  const currentValue = (event.target as HTMLInputElement)?.value;
  const nextValue = Number.parseFloat(currentValue);

  if (type === 'image') {
    slides.value[activeSlide.value].image.brightness = clamp(nextValue, 0, 1);
  }
  if (type === 'text') {
    slides.value[activeSlide.value].text.bgopacity = clamp(nextValue, 0, 1);
  }
};

const addSlide = async () => {
  const newSlide: Slide = {
    image: {
      desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
      brightness: 0.5,
      alt: '',
    },
    text: {
      pretitle: 'PreTitle',
      title: 'Title',
      subtitle: 'SubTitle',
      htmlDescription: 'Text that supports HTML formatting',
      color: '#000',
      bgcolor: '#fff',
      bgopacity: 1,
      textAlignment: 'left',
      justify: 'center',
      align: 'left',
    },
    button: {
      label: 'Button',
      link: 'Enter URL here',
      variant: 'primary',
    },
  };

  slides.value = [...slides.value, newSlide];

  await nextTick();
  slideClick(slides.value.length - 1);
};

const deleteSlide = async (index: number) => {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((_: BannerProps, i: number) => i !== index);
  if (activeSlide.value === index) {
    setIndex(index - 1);
  }
  await nextTick();
};

const moveSlideUp = async (index: number) => {
  if (index <= 0) return;

  const newSlides = [...slides.value];

  [newSlides[index - 1], newSlides[index]] = [newSlides[index], newSlides[index - 1]];
  slides.value = newSlides;

  await nextTick();

  if (activeSlide.value === index) {
    setIndex(index - 1);
  }
};

const moveSlideDown = async (index: number) => {
  if (index >= slides.value.length - 1) return;

  const newSlides = [...slides.value];

  [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]];
  slides.value = newSlides;

  await nextTick();

  if (activeSlide.value === index) {
    setIndex(index + 1);
  }
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
