<template>
  <div class="sticky top-[52px] h-[80vh] overflow-y-auto">
    <UiAccordionItem
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ t('elements-label') }}</h2>
      </template>

      <div
        v-for="(item, idx) in block.content.announcements"
        :key="item.meta.uuid"
        class="flex items-center justify-between p-2 rounded-lg mb-2"
      >
        <button class="cursor-grab p-1 hover:bg-gray-100 rounded-full shrink-0 mr-1">
          <NuxtImg width="18" height="18" :src="dragIcon" />
        </button>

        <span class="text-sm truncate flex-1">{{ item.text || t('empty-label') }}</span>

        <button class="p-1 hover:bg-gray-100 rounded-full shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
        </button>

        <button class="p-1 hover:bg-gray-100 rounded-full shrink-0">
          <SfIconMoreVert />
        </button>
      </div>

      <UiButton
        class="mt-4 w-full"
        variant="secondary"
        @click="addItem"
      >
        <SfIconAdd class="text-neutral-500" />
        {{ t('add-label') }}
      </UiButton>
    </UiAccordionItem>

    <UiAccordionItem
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ t('layout-label') }}</h2>
      </template>

      <div class="p-4 flex flex-col gap-4">
        <EditorFullWidthToggle v-model="isFullWidth" :block-uuid="blockUuid" />
        <div class="flex items-center justify-between">
          <UiFormLabel>{{ t('sticky-label') }}</UiFormLabel>
          <SfSwitch v-model="block.content.layout.stickyOnTop" />
        </div>

        <div class="mb-2">
          <UiFormLabel class="mb-1">{{ t('background-color-label') }}</UiFormLabel>
          <EditorColorPicker v-model="block.content.layout.backgroundColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <SfInput v-model="block.content.layout.backgroundColor" type="text">
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

        <div>
          <UiFormLabel class="mb-1">{{ t('padding-label') }}</UiFormLabel>
          <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowUpward /></span>
              <input
                v-model.number="block.content.layout.paddingTop"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-top"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowDownward /></span>
              <input
                v-model.number="block.content.layout.paddingBottom"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-bottom"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowBack /></span>
              <input
                v-model.number="block.content.layout.paddingLeft"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-left"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
              <span><SfIconArrowForward /></span>
              <input
                v-model.number="block.content.layout.paddingRight"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-right"
              />
            </div>
          </div>
        </div>
      </div>
    </UiAccordionItem>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd ,SfInput, SfSwitch, SfIconArrowUpward, SfIconArrowDownward, SfIconArrowBack, SfIconArrowForward, SfIconMoreVert } from '@storefront-ui/vue';
import dragIcon from '~/assets/icons/paths/drag.svg';
import { v4 as uuid } from 'uuid';
import type { AnnouncementBarProps } from './types';

const { t } = useI18n();
const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();


const block = computed({
  get: () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as AnnouncementBarProps,
  set: (val) => {
    const found = findOrDeleteBlockByUuid(data.value, blockUuid.value);
    if (found) Object.assign(found, val);
  }
});

const contentlayout = computed(() => block.value.content);

const { isFullWidth } = useFullWidthToggleForContent(contentlayout);

const addItem = () => {
  block.value.content.announcements.push({
    meta: { uuid: uuid() },
    text: 'New announcement',
  });
};

const deleteItem = (idx: number) => {
  if (block.value.content.announcements.length <= 1) return;
  block.value.content.announcements.splice(idx, 1);
};
</script>

<i18n lang="json">
{
  "en": {
    "elements-label": "Elements",
    "text-label": "Text",
    "layout-label": "Layout settings",
    "item-label": "Announcement",
    "add-label": "Add element",
    "empty-label": "(empty)",
    "background-color-label": "Background color",
    "sticky-label": "Sticky on top",
    "padding-label": "Padding (px)"
  },
  "de": {
    "elements-label": "Elemente",
    "text-label": "Text",
    "layout-label": "Layout-Einstellungen",
    "item-label": "Ankündigung",
    "add-label": "Element hinzufügen",
    "empty-label": "(leer)",
    "background-color-label": "Hintergrundfarbe",
    "sticky-label": "Am oberen Rand fixieren",
    "padding-label": "Innenabstand (px)"
  }
}
</i18n>