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

      <div>
        <draggable
          v-if="slides.length"
          v-model="slides"
          item-key="meta.uuid"
          handle=".drag-slides-handle"
          class=""
          :filter="'.no-drag'"
        >
          <template #item="{ element: slide, index }">
            <div
              :key="slide.meta.uuid"
              class="mb-3 flex items-center justify-between bg-white  rounded-lg  transition-colors"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <button
                  class="drag-slides-handle cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
                  :aria-label="getEditorTranslation('drag-reorder-aria')"
                  :data-testid="`actions-drag-slide-handle-${index}`"
                >
                  <NuxtImg width="18" height="18" :src="dragIcon" />
                </button>

                <span
                  class="text-sm font-medium truncate"
                  :class="slide.configuration?.visible !== false ? 'text-gray-700' : 'text-gray-400'"
                >
                  {{ getEditorTranslation('slide-label') }} {{ index + 1 }}
                </span>
              </div>

              <button
                :data-testid="`actions-edit-slide-${index}`"
                class=" text-gray-500  rounded-full no-drag"
                :aria-label="getEditorTranslation('edit-slide-aria')"
                @click="editSlide(index)"
              >
                <SfIconBase size="xs" viewBox="0 0 18 18">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path :d="editPath" fill="currentColor" />
                  </svg>
                </SfIconBase>
              </button>

              <div :key="`menu-${index}`" class="relative">
                <button
                  :data-testid="`actions-menu-slide-${index}`"
                  class="text-gray-500  rounded-full no-drag"
                  @click="toggleSlideMenu(index)"
                >
                  <SfIconMoreVert />
                </button>

                <div
                  v-if="openSlideMenuIndex === index"
                  class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50"
                  @click.stop
                >
                  <div class="px-4 py-3 border-b">
                    <div class="flex items-center justify-between">
                      <UiFormLabel class="mb-0">{{ getEditorTranslation('visibility-label') }}</UiFormLabel>
                      <SfSwitch
                        :model-value="slides[index]?.configuration?.visible !== false"
                        :data-testid="`actions-toggle-visibility-slide-${index}`"
                        :aria-label="getEditorTranslation('toggle-visibility-aria')"
                        class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
                        @update:model-value="toggleSlideVisibility(index)"
                      />
                    </div>
                  </div>

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

        <div class="pt-4">
          <button
            data-testid="actions-add-slide-button"
            class="border border-editor-button w-full py-1 rounded-md flex items-center justify-center gap-1 text-editor-button"
            @click="addSlide"
          >
            <SfIconAdd />
            {{ getEditorTranslation('add-slide-label') }}
          </button>
        </div>
      </div>
    </UiAccordionItem>

    <div v-else-if="slides[editingSlideIndex]" class="space-y-0">
      <BlocksBannerCarouselBannerForm :uuid="slides[editingSlideIndex]!.meta.uuid" />
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
import {
  SfIconDelete,
  SfInput,
  SfIconAdd,
  SfIconMoreVert,
  SfIconBase,
  SfSwitch,
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

const emit = defineEmits<{
  'set-edit-title': [title: string];
  'clear-edit-title': [];
}>();

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
    const content = (carouselStructure.value?.content || []) as BannerProps[];

    return content.map((slide) => ({
      ...slide,
      configuration: {
        ...slide.configuration,
        visible: slide.configuration?.visible !== false,
      },
    }));
  },
  set: (value: BannerProps[]) => updateBannerItems(value, blockUuid.value),
});

const editSlide = (index: number) => {
  editingSlideIndex.value = index;
  openSlideMenuIndex.value = undefined;
  // Scroll the swiper to this slide
  setIndex(blockUuid.value, index);
  emit('set-edit-title', `Slide ${index + 1}`);
};

const exitEditMode = (shouldEmit = true) => {
  editingSlideIndex.value = undefined;
  openSlideMenuIndex.value = undefined;
  if (shouldEmit) {
    emit('clear-edit-title');
  }
};

const toggleSlideMenu = (index: number) => {
  if (openSlideMenuIndex.value === index) {
    openSlideMenuIndex.value = undefined;
  } else {
    openSlideMenuIndex.value = index;
  }
};

// Handle click outside to close popover
onMounted(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (openSlideMenuIndex.value === undefined) return;

    const target = event.target as HTMLElement;
    // Get the currently open menu and button
    const openMenuButton = document.querySelector(
      `[data-testid="actions-menu-slide-${openSlideMenuIndex.value}"]`
    );
    const openMenu = document.querySelector(
      `[data-testid="actions-menu-slide-${openSlideMenuIndex.value}"]`
    )?.parentElement?.querySelector('.absolute.right-0');

    // Check if click is outside both the button and the menu
    if (openMenuButton && openMenu) {
      const isClickOnButton = openMenuButton.contains(target);
      const isClickOnMenu = openMenu.contains(target);

      if (!isClickOnButton && !isClickOnMenu) {
        openSlideMenuIndex.value = undefined;
      }
    }
  };

  document.addEventListener('click', handleClickOutside);

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
});

const addSlide = async () => {
  const newSlide: BannerProps = {
    name: 'Banner',
    type: 'content',
    configuration: {
      visible: true,
    },
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

const toggleSlideVisibility = (index: number) => {
  const slide = slides.value[index];

  if (!slide) return;

  const updatedSlides = [...slides.value];
  const slideToUpdate = updatedSlides[index];

  if (!slideToUpdate) return;

  if (!slideToUpdate.configuration) {
    slideToUpdate.configuration = { visible: true };
  }

  slideToUpdate.configuration.visible = !slideToUpdate.configuration.visible;

  slides.value = updatedSlides;
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
    "elements-group-label": "Elements",
    "slide-label": "Slide",
    "add-slide-label": "Add Slide",
    "drag-reorder-aria": "Drag to reorder slide",
    "edit-slide-aria": "Edit slide",
    "back-aria": "Go back to slides list",
    "layout-label": "Layout",
    "controls-group-label": "Controls",
    "controls-color-label": "Slider Controls Colour",
    "visibility-label": "Visibility",
    "toggle-visibility-aria": "Toggle slide visibility",
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
    "visibility-label": "Visibility",
    "toggle-visibility-aria": "Toggle slide visibility",
    "delete-slide-label": "Delete"
  }
}
</i18n>
