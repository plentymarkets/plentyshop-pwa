<template>
  <div class="sticky top-[52px] h-[80vh] overflow-y-auto">

    <div v-if="editingIdx !== null">
      <div class="flex items-center gap-2 px-4 py-3 border-b">
        <button class="p-1 hover:bg-gray-100 rounded-full" @click="editingIdx = null">
          <SfIconArrowBack />
        </button>
        <span class="text-sm font-medium truncate flex-1" v-html="announcements[editingIdx]?.text"/>
        <button class="p-1 hover:bg-gray-100 rounded-full" @click="editingIdx = null">
          <SfIconClose />
        </button>
      </div>

      <UiAccordionItem
        :model-value="true"
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>{{ t('text-label') }}</h2>
        </template>

        <div class="py-2 px-2">
          <UiFormLabel class="mb-1">{{ t('text-label') }}</UiFormLabel>
          <EditorRichTextEditor
            v-if="editingIdx !== null"
            v-model="editingText"
            v-model:expanded="expandedToolbar"
            :min-height="100"
            :expandable="true"
          />
        </div>
      </UiAccordionItem>
    </div>

    <template v-else>
      <UiAccordionItem
        summary-active-class="bg-neutral-100"
        summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
      >
        <template #summary>
          <h2>{{ t('elements-label') }}</h2>
        </template>

        <draggable
          v-model="announcements"
          item-key="meta.uuid"
          handle=".drag-handle"
        >
          <template #item="{ element: item, index: idx }">
            <div
              :key="item.meta.uuid"
              class="flex items-center justify-between p-2 rounded-lg mb-2"
            >
              <button class="drag-handle cursor-grab p-1 hover:bg-gray-100 rounded-full shrink-0 mr-1">
                <NuxtImg width="18" height="18" :src="dragIcon" />
              </button>

              <span class="text-sm truncate flex-1 w-6" v-html="item.text || t('empty-label')"/>

              <button class="p-1 hover:bg-gray-100 rounded-full shrink-0" @click="editingIdx = idx">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#1f1f1f"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
              </button>

              <div class="relative">
                <button
                  class="p-1 hover:bg-gray-100 rounded-full shrink-0"
                  @click="toggleMenu(idx)"
                >
                  <SfIconMoreVert />
                </button>

                <div
                  v-if="openMenuIdx === idx"
                  class="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-50"
                >
                  <div class="flex items-center justify-between px-4 py-3 border-b">
                    <span class="text-sm">{{ t('visibility-label') }}</span>
                    <SfSwitch v-model="item.visible" :disabled="isLastVisibleItem(idx)" />
                  </div>
                  <button
                    class="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-gray-50 text-sm"
                    :disabled="announcements.length === 1"
                    @click="deleteItem(idx)"
                  >
                    <SfIconDelete class="text-red-500" />
                    {{ t('delete-label') }}
                  </button>
                </div>
              </div>
            </div>
          </template>
        </draggable>

        <UiButton class="mt-4 w-full" variant="secondary" @click="addItem">
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
                <input v-model.number="block.content.layout.paddingTop" type="number" class="w-12 text-center outline-none" />
              </div>
              <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
                <span><SfIconArrowDownward /></span>
                <input v-model.number="block.content.layout.paddingBottom" type="number" class="w-12 text-center outline-none" />
              </div>
              <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
                <span><SfIconArrowBack /></span>
                <input v-model.number="block.content.layout.paddingLeft" type="number" class="w-12 text-center outline-none" />
              </div>
              <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
                <span><SfIconArrowForward /></span>
                <input v-model.number="block.content.layout.paddingRight" type="number" class="w-12 text-center outline-none" />
              </div>
            </div>
          </div>
        </div>
      </UiAccordionItem>
    </template>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd, SfIconDelete, SfIconClose, SfInput, SfSwitch, SfIconArrowUpward, SfIconArrowDownward, SfIconArrowBack, SfIconArrowForward, SfIconMoreVert } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
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

const openMenuIdx = ref<number | null>(null);
const editingIdx = ref<number | null>(null);
const expandedToolbar = ref(true);

const block = computed({
  get: () => (findOrDeleteBlockByUuid(data.value, blockUuid.value) || {}) as AnnouncementBarProps,
  set: (val) => {
    const found = findOrDeleteBlockByUuid(data.value, blockUuid.value);
    if (found) Object.assign(found, val);
  }
});

const announcements = computed({
  get: () => block.value.content.announcements,
  set: (val) => { block.value.content.announcements = val; }
});

const editingText = computed({
  get: () => editingIdx.value !== null ? (announcements.value[editingIdx.value]?.text ?? '') : '',
  set: (val) => {
    if (editingIdx.value !== null && announcements.value[editingIdx.value]) {
      announcements.value[editingIdx.value]!.text = val;
    }
  }
});

const contentlayout = computed(() => block.value.content);
const { isFullWidth } = useFullWidthToggleForContent(contentlayout);

const isLastVisibleItem = (idx: number) => {
  const visibleCount = announcements.value.filter((a) => a.visible !== false).length;
  return visibleCount === 1 && announcements.value[idx]?.visible !== false;
};

const toggleMenu = (idx: number) => {
  openMenuIdx.value = openMenuIdx.value === idx ? null : idx;
};

const addItem = () => {
  announcements.value.push({
    meta: { uuid: uuid() },
    text: 'New announcement',
    visible: true,
  });
};

const deleteItem = (idx: number) => {
  if (announcements.value.length <= 1) return;
  announcements.value.splice(idx, 1);
  openMenuIdx.value = null;
};
</script>

<i18n lang="json">
{
  "en": {
    "elements-label": "Elements",
    "text-label": "Text",
    "layout-label": "Layout settings",
    "add-label": "Add element",
    "empty-label": "(empty)",
    "background-color-label": "Background color",
    "sticky-label": "Sticky on top",
    "padding-label": "Padding (px)",
    "visibility-label": "Visibility",
    "delete-label": "Delete"
  },
  "de": {
    "elements-label": "Elemente",
    "text-label": "Text",
    "layout-label": "Layout-Einstellungen",
    "add-label": "Element hinzufügen",
    "empty-label": "(leer)",
    "background-color-label": "Hintergrundfarbe",
    "sticky-label": "Am oberen Rand fixieren",
    "padding-label": "Innenabstand (px)",
    "visibility-label": "Sichtbarkeit",
    "delete-label": "Löschen"
  }
}
</i18n>