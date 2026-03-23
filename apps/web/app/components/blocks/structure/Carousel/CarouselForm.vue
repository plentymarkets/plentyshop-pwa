<template>
  <div data-testid="banner-carousel-form" class="block-slider-edit sticky h-[80vh] overflow-y-auto">
    <EditorBlockItemsAccordion
      v-if="editingSlideIndex === undefined"
      v-model="elementsOpen"
      :items="slides"
      :item-labels="slideLabels"
      :current-active-index="currentActiveSlideIndex"
      :min-items="1"
      @select-item="selectSlide"
      @edit-item="editSlide"
      @add-item="addSlide"
      @delete-item="deleteSlide"
      @toggle-item-visibility="toggleSlideVisibility"
      @update:items="updateBlocks"
    />

    <div v-else-if="slides[editingSlideIndex]" class="space-y-0">
      <component :is="blockForm" :uuid="slides[editingSlideIndex]!.meta.uuid" />
    </div>

    <template v-if="editingSlideIndex === undefined">
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

      <!-- Layout Section (Carousel-wide) -->
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
    </template>
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import type { CarouselStructureProps, SlideBlock } from './types';

const { blockUuid } = useSiteConfiguration();
const { updateCarouselItems, setIndex, activeSlideIndex, createSlide, getSlideLabel } = useCarousel();
const { toggleBlockVisibility } = useBlocksVisibility();
const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const emit = defineEmits<{
  'set-edit-title': [title: string];
  'clear-edit-title': [];
}>();

const elementsOpen = ref(true);
const editingSlideIndex = ref<number | undefined>(undefined);
const layoutOpen = ref(true);
const controlsOpen = ref(true);
const slideLabels = ref<string[]>([]);

setIndex(blockUuid.value, 0);

const blockForm = computed(() => {
  if (editingSlideIndex.value === undefined) return null;

  const slide = slides.value[editingSlideIndex.value];
  if (!slide) return null;

  const loader = getBlockFormLoader(slide.name);
  return loader ? defineAsyncComponent(loader) : null;
});

const carouselStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as CarouselStructureProps,
);

const { isFullWidth } = useFullWidthToggleForConfig(
  computed(() => carouselStructure.value.configuration),
  { fullWidth: true },
);

const controls = computed(() => carouselStructure.value.configuration.controls);

const currentActiveSlideIndex = computed(() => activeSlideIndex.value[blockUuid.value]);

const slides = computed({
  get: () => {
    const content = (carouselStructure.value?.content || []) as SlideBlock[];

    return content.map((slide) => ({
      ...slide,
      configuration: {
        ...slide.configuration,
        visible: slide.configuration?.visible !== false,
      },
    }));
  },
  set: (value: SlideBlock[]) => updateCarouselItems(value, blockUuid.value),
});

const resolveSlideLabels = async () => {
  slideLabels.value = await Promise.all(slides.value.map((slide, index) => getSlideLabel(slide, index)));
};

const selectSlide = (index: number) => {
  setIndex(blockUuid.value, index);
};

const editSlide = (index: number) => {
  editingSlideIndex.value = index;
  setIndex(blockUuid.value, index);
  emit('set-edit-title', slideLabels.value[index]!);
};

const exitEditMode = (shouldEmit = true) => {
  editingSlideIndex.value = undefined;
  if (shouldEmit) {
    emit('clear-edit-title');
  }
  resolveSlideLabels();
};

watch(
  () => slides.value.map((slide) => slide.meta.uuid),
  () => {
    resolveSlideLabels();
  },
  { immediate: true },
);

const addSlide = async () => {
  const slideType = slides.value[0]?.name ?? 'Banner';
  const newSlide = await createSlide(slideType, slides.value.length);

  slides.value = [...slides.value, newSlide];

  await nextTick();

  setIndex(blockUuid.value, slides.value.length - 1);
};

const deleteSlide = async (index: number) => {
  if (slides.value.length <= 1) return;
  slides.value = slides.value.filter((_: SlideBlock, i: number) => i !== index);
  setIndex(blockUuid.value, 0);
  await nextTick();
  if (editingSlideIndex.value === index) {
    exitEditMode();
  }
};

const toggleSlideVisibility = (index: number) => {
  const slide = slides.value[index];
  if (!slide) return;

  const updatedSlides = [...slides.value];
  const slideToUpdate = updatedSlides[index];
  if (!slideToUpdate) return;

  toggleBlockVisibility(slideToUpdate);
  slides.value = updatedSlides;
};

const updateBlocks = (newBlocks: SlideBlock[]) => {
  slides.value = newBlocks;
};

defineExpose({
  exitEditMode,
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
}
</style>

<i18n lang="json">
{
  "en": {
    "slide-label": "Slide",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "full-width": "Enable full width",
    "full-width-tooltip": "Full width is only available for top-level blocks. This option is disabled for nested blocks (e.g., inside MultiGrid)."
  },
  "de": {
    "slide-label": "Slide",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "full-width": "Enable full width",
    "full-width-tooltip": "Full width is only available for top-level blocks. This option is disabled for nested blocks (e.g., inside MultiGrid)."
  }
}
</i18n>
