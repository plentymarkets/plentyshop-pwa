<template>
  <div class="sticky top-[52px] h-[80vh] overflow-y-auto">
    <UiAccordionItem
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ t('elements-label') }}</h2>
      </template>

      <div class="p-4 flex flex-col gap-2">
        <div
          v-for="(item, idx) in block.content"
          :key="item.meta.uuid"
          class="flex items-center justify-between p-2 border rounded-lg"
        >
          <span class="text-sm truncate flex-1">{{ item.text || t('empty-label') }}</span>
          <button
            class="p-1 hover:bg-gray-100 rounded-full ml-2 shrink-0"
            :disabled="block.content.length === 1"
            @click="deleteItem(idx)"
          >
            <SfIconDelete class="text-neutral-500" :class="{ 'opacity-30': block.content.length === 1 }" />
          </button>
        </div>

        <UiButton
          class="mt-4"
          variant="secondary"
          @click="addItem"
        >
          <SfIconAdd class="text-neutral-500" />
          {{ t('add-label') }}
        </UiButton>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      v-if="block.content.length"
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ t('text-label') }}</h2>
      </template>

      <div class="p-4 flex flex-col gap-4">
        <div v-for="(item, idx) in block.content" :key="item.meta.uuid">
          <UiFormLabel class="mb-1">{{ t('item-label') }} {{ idx + 1 }}</UiFormLabel>
          <SfInput v-model="item.text" type="text" />
        </div>
      </div>
    </UiAccordionItem>

    <UiAccordionItem
      summary-active-class="bg-neutral-100"
      summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
    >
      <template #summary>
        <h2>{{ t('layout-label') }}</h2>
      </template>

      <div class="p-4 flex flex-col gap-4">
        <div class="flex items-center justify-between">
          <UiFormLabel>{{ t('sticky-label') }}</UiFormLabel>
          <SfSwitch v-model="block.layout.stickyOnTop" />
        </div>

        <div class="mb-2">
          <UiFormLabel class="mb-1">{{ t('background-color-label') }}</UiFormLabel>
          <EditorColorPicker v-model="block.layout.backgroundColor" class="w-full">
            <template #trigger="{ color, toggle }">
              <SfInput v-model="block.layout.backgroundColor" type="text">
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
                v-model.number="block.layout.paddingTop"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-top"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowDownward /></span>
              <input
                v-model.number="block.layout.paddingBottom"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-bottom"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
              <span><SfIconArrowBack /></span>
              <input
                v-model.number="block.layout.paddingLeft"
                type="number"
                class="w-12 text-center outline-none"
                data-testid="padding-left"
              />
            </div>
            <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
              <span><SfIconArrowForward /></span>
              <input
                v-model.number="block.layout.paddingRight"
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
import { SfIconDelete, SfIconAdd, SfInput, SfSwitch, SfIconArrowUpward, SfIconArrowDownward, SfIconArrowBack, SfIconArrowForward } from '@storefront-ui/vue';
import { v4 as uuid } from 'uuid';
import type { AnnouncementBarProps, AnnouncementBarContent } from './types';

const { t } = useI18n();
const { blockUuid } = useSiteConfiguration();
const route = useRoute();
const { data } = useCategoryTemplate(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);
const { findOrDeleteBlockByUuid } = useBlockManager();

const block = computed(
  () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as AnnouncementBarProps,
);

const addItem = () => {
  block.value.content.push({
    meta: { uuid: uuid() },
    text: 'New announcement',
  } as AnnouncementBarContent);
};

const deleteItem = (idx: number) => {
  if (block.value.content.length <= 1) return;
  block.value.content.splice(idx, 1);
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