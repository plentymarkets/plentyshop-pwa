<template>
  <div data-testid="banner-carousel-form" class="block-slider-edit sticky top-[52px] h-[80vh] overflow-y-auto">
    <UiAccordionItem
      v-if="editingSlideIndex === undefined"
      v-model="elementsOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('elements-group-label') }}</h2>
      </template>

      <div class="px-4 py-4">
        <draggable
          v-if="slides.length"
          v-model="slides"
          item-key="meta.uuid"
          handle=".drag-slides-handle"
          class="space-y-2"
          :filter="'.no-drag'"
        >
          <template #item="{ element: slide, index }">
            <div
              :key="slide.meta.uuid"
              class="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <button
                  class="drag-slides-handle cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                  :aria-label="getEditorTranslation('drag-reorder-aria')"
                  :data-testid="`actions-drag-slide-handle-${index}`"
                >
                  <NuxtImg width="18" height="18" :src="dragIcon" />
                </button>

                <span class="text-sm font-medium text-gray-700 truncate">
                  {{ getEditorTranslation('slide-label') }} {{ index + 1 }}
                </span>
              </div>

              <button
                :data-testid="`actions-edit-slide-${index}`"
                class="p-2 text-gray-500 hover:bg-gray-100 rounded-full no-drag"
                :aria-label="getEditorTranslation('edit-slide-aria')"
                @click="editSlide(index)"
              >
                <SfIconBase size="xs" viewBox="0 0 18 18" class="text-neutral-500">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path :d="editPath" fill="currentColor" />
                  </svg>
                </SfIconBase>
              </button>

              <div class="relative">
                <button
                  :data-testid="`actions-menu-slide-${index}`"
                  class="p-2 text-gray-500 hover:bg-gray-100 rounded-full no-drag"
                  @click="toggleSlideMenu(index)"
                >
                  <SfIconMoreVert class="text-neutral-500" />
                </button>

                <div
                  v-if="openSlideMenuIndex === index"
                  class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50"
                >
                  <button
                    v-if="index > 0"
                    :data-testid="`actions-move-slide-up-${index}`"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-b"
                    @click="moveSlideUp(index)"
                  >
                    <SfIconExpandLess size="sm" />
                    {{ getEditorTranslation('move-slide-up-label') }}
                  </button>

                  <button
                    v-if="index < slides.length - 1"
                    :data-testid="`actions-move-slide-down-${index}`"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 border-b"
                    @click="moveSlideDown(index)"
                  >
                    <SfIconExpandMore size="sm" />
                    {{ getEditorTranslation('move-slide-down-label') }}
                  </button>

                  <button
                    :data-testid="`actions-delete-slide-${index}`"
                    class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    :disabled="slides.length === 1"
                    @click="deleteSlide(index)"
                  >
                    <SfIconDelete size="sm" />
                    {{ getEditorTranslation('delete-slide-label') }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <div class="pt-4 border-t">
          <button
            data-testid="actions-add-slide-button"
            class="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            @click="addSlide"
          >
            <SfIconAdd class="text-neutral-500" />
            {{ getEditorTranslation('add-slide-label') }}
          </button>
        </div>
      </div>
    </UiAccordionItem>

    <div v-else-if="slides[editingSlideIndex]" class="space-y-0">
      <div class="flex items-center gap-3 p-4 border-b bg-white sticky top-0 z-10">
        <button
          :data-testid="'actions-back-from-edit'"
          class="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          :aria-label="getEditorTranslation('back-aria')"
          @click="exitEditMode"
        >
          <SfIconChevronLeft class="text-neutral-500" />
        </button>
        <h2 class="text-sm font-medium">
          {{ getEditorTranslation('slide-label') }} {{ editingSlideIndex + 1 }}
        </h2>
      </div>

      <BlocksBannerCarouselBannerForm :uuid="slides[editingSlideIndex]!.meta.uuid" />
    </div>

    <UiAccordionItem
      v-model="controlsOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ getEditorTranslation('controls-group-label') }}</h2>
      </template>

      <div class="controls">
        <div class="mb-6 mt-4">
          <UiFormLabel class="mb-1">{{ getEditorTranslation('controls-color-label') }}</UiFormLabel>
          <EditorColorPicker v-model="controls.color" class="w-full">
            <template #trigger="{ color, toggle }">
              <SfInput v-model="controls.color" type="text">
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
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-model="layoutOpen"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2 data-testid="slider-button-group-title">{{ getEditorTranslation('layout-label') }}</h2>
      </template>
      <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import {
  SfIconChevronLeft,
  SfIconDelete,
  SfInput,
  SfIconAdd,
  SfIconExpandMore,
  SfIconExpandLess,
  SfIconMoreVert,
  SfIconBase,
} from '@storefront-ui/vue';
import type { CarouselStructureProps } from './types';
import { v4 as uuid } from 'uuid';
import type { BannerProps } from '~/components/blocks/BannerCarousel/types';
import draggable from 'vuedraggable/src/vuedraggable';
import dragIcon from '~/assets/icons/paths/drag.svg';
import { editPath } from '~/assets/icons/paths/edit';

const { blockUuid } = useSiteConfiguration();
const { updateBannerItems, setIndex } = useCarousel();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const elementsOpen = ref(true);
const editingSlideIndex = ref<number | undefined>(undefined);
const openSlideMenuIndex = ref<number | undefined>(undefined);
const layoutOpen = ref(true);
const controlsOpen = ref(true);

setIndex(blockUuid.value, 0);

const carouselStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as CarouselStructureProps,
);
const { isFullWidth } = useFullWidthToggleForConfig(
  computed(() => carouselStructure.value.configuration),
  { fullWidth: true },
);
const controls = computed(() => carouselStructure.value.configuration.controls);

const slides = computed({
  get: () => {
    return (carouselStructure.value?.content || []) as BannerProps[];
  },
  set: (value: BannerProps[]) => updateBannerItems(value, blockUuid.value),
});

const editSlide = (index: number) => {
  editingSlideIndex.value = index;
  openSlideMenuIndex.value = undefined;
};

const exitEditMode = () => {
  editingSlideIndex.value = undefined;
  openSlideMenuIndex.value = undefined;
};

const toggleSlideMenu = (index: number) => {
  if (openSlideMenuIndex.value === index) {
    openSlideMenuIndex.value = undefined;
  } else {
    openSlideMenuIndex.value = index;
  }
};

const addSlide = async () => {
  const newSlide: BannerProps = {
    name: 'Banner',
    type: 'content',
    content: {
      image: {
        wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
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
        background: false,
      },
      button: {
        label: 'Button',
        link: '/',
        variant: 'primary',
      },
    },
    meta: {
      uuid: uuid(),
    },
    lazyLoading: 'eager',
    index: slides.value.length,
  };

  slides.value = [...slides.value, newSlide] as BannerProps[];

  await nextTick();

  openSlideMenuIndex.value = undefined;
  setIndex(blockUuid.value, slides.value.length - 1);
};

const deleteSlide = async (index: number) => {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((_: BannerProps, i: number) => i !== index);
  setIndex(blockUuid.value, 0);
  await nextTick();
  openSlideMenuIndex.value = undefined;
  if (editingSlideIndex.value === index) {
    exitEditMode();
  }
};

const moveSlideUp = async (index: number) => {
  if (index <= 0) return;

  const newSlides = [...slides.value] as BannerProps[];
  const current = newSlides[index];
  const previous = newSlides[index - 1];
  if (!current || !previous) return;

  [newSlides[index - 1], newSlides[index]] = [current, previous];
  slides.value = newSlides;

  if (editingSlideIndex.value === index) {
    editingSlideIndex.value = index - 1;
  }

  setIndex(blockUuid.value, index - 1);
  openSlideMenuIndex.value = undefined;
  await nextTick();
};

const moveSlideDown = async (index: number) => {
  if (index >= slides.value.length - 1) return;

  const newSlides = [...slides.value] as BannerProps[];
  const current = newSlides[index];
  const next = newSlides[index + 1];
  if (!current || !next) return;

  [newSlides[index], newSlides[index + 1]] = [next, current];
  slides.value = newSlides;

  if (editingSlideIndex.value === index) {
    editingSlideIndex.value = index + 1;
  }

  setIndex(blockUuid.value, index + 1);
  openSlideMenuIndex.value = undefined;
  await nextTick();
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
}
</style>

<i18n lang="json">
{
  "en": {
    "elements-group-label": "Elements",
    "slide-label": "Slide",
    "add-slide-label": "Add Slide",
    "drag-reorder-aria": "Drag to reorder slide",
    "edit-slide-aria": "Edit slide",
    "back-aria": "Go back to slides list",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "move-slide-up-label": "Move Up",
    "move-slide-down-label": "Move Down",
    "delete-slide-label": "Delete"
  },
  "de": {
    "elements-group-label": "Elements",
    "slide-label": "Slide",
    "add-slide-label": "Add Slide",
    "drag-reorder-aria": "Drag to reorder slide",
    "edit-slide-aria": "Edit slide",
    "back-aria": "Go back to slides list",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "move-slide-up-label": "Move Up",
    "move-slide-down-label": "Move Down",
    "delete-slide-label": "Delete"
  }
}
</i18n>
