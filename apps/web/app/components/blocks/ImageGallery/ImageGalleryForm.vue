<template>
  <UiAccordionItem
    v-model="thumbsOpen"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    data-testid="item-image-thumbnails"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('item-image-label') }}</h2>
    </template>

    <div class="space-y-5">
      <div class="flex items-center justify-between">
        <UiFormLabel>{{ getEditorTranslation('show-thumbnails') }}</UiFormLabel>
        <SfSwitch v-model="uiItemImageBlock.thumbnails.showThumbnails" data-testid="show-thumbnails" />
      </div>

      <div v-show="uiItemImageBlock.thumbnails.showThumbnails" class="space-y-3">
        <UiFormLabel>{{ getEditorTranslation('thumbnail-type') }}</UiFormLabel>

        <div class="grid grid-cols-2 gap-3">
          <button
            v-for="type in THUMBNAILS"
            :key="type"
            type="button"
            class="relative w-full rounded-lg border p-2 transition"
            :class="
              uiItemImageBlock.thumbnails.thumbnailType === type
                ? 'border-neutral-900 ring-2 ring-neutral-900'
                : 'border-neutral-300 hover:border-neutral-400'
            "
            :aria-pressed="uiItemImageBlock.thumbnails.thumbnailType === type"
            :aria-label="thumbnails[type].label"
            data-testid="thumbnail-type-card"
            @click="uiItemImageBlock.thumbnails.thumbnailType = type"
          >
            <NuxtImg :src="thumbnails[type].cdn" :alt="thumbnails[type].label" class="w-full h-auto rounded" />
            <span
              v-if="uiItemImageBlock.thumbnails.thumbnailType === type"
              class="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-neutral-900 text-white text-xs"
              ><SfIconCheck size="xs"
            /></span>
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between">
        <UiFormLabel>{{ getEditorTranslation('enable-zoom-on-hover') }}</UiFormLabel>
        <SfSwitch v-model="uiItemImageBlock.thumbnails.enableHoverZoom" data-testid="enable-zoom-on-hover" />
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import { SfSwitch, SfIconCheck } from '@storefront-ui/vue';
import { THUMBNAILS } from '~/components/blocks/ImageGallery/types';
import type { ImageGalleryContent } from '~/components/Gallery/types';

type ItemImageFormProps = {
  uuid?: string;
};

const props = defineProps<ItemImageFormProps>();

const { data } = useCategoryTemplate();
const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const uiItemImageBlock = computed(
  () => findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content as ImageGalleryContent,
);

const thumbsOpen = ref(true);

const thumbnails = {
  'left-vertical': {
    cdn: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/preview-thumbs-left.png',
    label: getEditorTranslation('thumb-left-vertical'),
  },
  'right-vertical': {
    cdn: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/preview-thumbs-right.png',
    label: getEditorTranslation('thumb-right-vertical'),
  },
  'bottom': {
    cdn: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/Blocks/preview-thumbs-bottom.png',
    label: getEditorTranslation('thumb-bottom'),
  },
};
</script>

<i18n lang="json">
{
  "en": {
    "item-image-label": "Item image",
    "show-thumbnails": "Show thumbnails",
    "thumbnail-type": "Thumbnail type",
    "enable-zoom-on-hover": "Enable zoom on hover",
    "thumb-left-vertical": "Left vertical strip",
    "thumb-right-vertical": "Right vertical strip",
    "thumb-bottom": "Bottom strip"
  },
  "de": {
    "item-image-label": "Item image",
    "show-thumbnails": "Show thumbnails",
    "thumbnail-type": "Thumbnail type",
    "enable-zoom-on-hover": "Enable zoom on hover",
    "thumb-left-vertical": "Left vertical strip",
    "thumb-right-vertical": "Right vertical strip",
    "thumb-bottom": "Bottom strip"
  }
}
</i18n>
