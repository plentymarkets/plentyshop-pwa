<template>
  <div data-testid="banner-carousel-form" class="block-slider-edit sticky h-[80vh] overflow-y-auto">
    <div v-if="!editingBlock" class="space-y-0">
      <EditorGridElementsPanel
        v-model="elementsOpen"
        :uuid="resolvedUuid"
        :min-items="1"
        :custom-add="true"
        @edit-element="editSlide"
        @add-element="addSlide"
      />

      <EditorFormPanel v-model="controlsOpen" :title="getEditorTranslation('controls-group-label')">
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
      </EditorFormPanel>

      <EditorFormPanel
        v-model="layoutOpen"
        :title="getEditorTranslation('layout-label')"
        data-testid="slider-button-group-title"
      >
        <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="resolvedUuid" />
      </EditorFormPanel>
    </div>

    <div v-else class="space-y-0">
      <component :is="blockForm" :uuid="editingBlock.meta.uuid" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfInput } from '@storefront-ui/vue';
import type { CarouselStructureProps, SlideBlock } from './types';
import type { Block } from '@plentymarkets/shop-api';

const props = defineProps<{ uuid?: string }>();

const { blockUuid } = useSiteConfiguration();
const resolvedUuid = computed(() => props.uuid || blockUuid.value);
const { updateCarouselItems, setIndex, createSlide } = useCarousel();
const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();

const elementsOpen = ref(true);
const layoutOpen = ref(true);
const controlsOpen = ref(true);
const { editingBlock, blockForm } = useNestedBlockForm(resolvedUuid);
const { pushEdit } = useBlockEditStack();

const carouselStructure = computed(
  () => (findOrDeleteBlockByUuid(data.value, resolvedUuid.value) || {}) as CarouselStructureProps,
);

const { isFullWidth } = useFullWidthToggleForConfig(
  computed(() => carouselStructure.value.configuration),
  { fullWidth: true },
);

const controls = computed(() => carouselStructure.value.configuration?.controls ?? { color: '', displayArrows: true });

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
  set: (value: SlideBlock[]) => updateCarouselItems(value, resolvedUuid.value),
});

const editSlide = (block: Block) => {
  const idx = slides.value.findIndex((s) => s.meta.uuid === block.meta.uuid);
  if (idx >= 0) setIndex(resolvedUuid.value, idx);
  pushEdit(block);
};

const addSlide = async () => {
  const slideType = slides.value[0]?.name ?? 'Banner';
  const newSlide = await createSlide(slideType, slides.value.length);
  slides.value = [...slides.value, newSlide];
  await nextTick();
  setIndex(resolvedUuid.value, slides.value.length - 1);
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
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour"
  },
  "de": {
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour"
  }
}
</i18n>
