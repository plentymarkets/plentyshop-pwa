<template>
  <UiAccordionItem
    v-model="isOpen"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2 data-testid="utility-bar-layout-title">{{ getEditorTranslation('layout-label') }}</h2>
    </template>

    <div class="space-y-4 py-4">
      <div>
        <UiFormLabel class="mb-1">{{ getEditorTranslation('header-bg-color-label') }}</UiFormLabel>
        <EditorColorPicker v-model="headerBgColor" class="w-full">
          <template #trigger="{ color, toggle }">
            <SfInput v-model="headerBgColor" type="text">
              <template #suffix>
                <div
                  class="w-6 h-6 rounded border cursor-pointer"
                  :style="{ backgroundColor: color }"
                  @click="toggle"
                />
              </template>
            </SfInput>
          </template>
        </EditorColorPicker>
      </div>

      <div>
        <UiFormLabel class="mb-1">{{ getEditorTranslation('icon-color-label') }}</UiFormLabel>
        <EditorColorPicker v-model="iconColor" class="w-full">
          <template #trigger="{ color, toggle }">
            <SfInput v-model="iconColor" type="text" @click="toggle">
              <template #suffix>
                <div
                  class="w-6 h-6 rounded border cursor-pointer"
                  :style="{ backgroundColor: color }"
                  @click="toggle"
                />
              </template>
            </SfInput>
          </template>
        </EditorColorPicker>
      </div>
    </div>

    <div class="py-2">
      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="paddingTop"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-top"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="paddingBottom"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-bottom"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="paddingLeft"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-left"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="paddingRight"
            type="number"
            class="w-12 text-center outline-none"
            data-testid="padding-right"
          />
        </div>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import {
  SfInput,
  SfIconArrowDownward,
  SfIconArrowUpward,
  SfIconArrowBack,
  SfIconArrowForward,
} from '@storefront-ui/vue';
import type { UtilityBarProps } from '../types';

const props = defineProps<{
  configuration: UtilityBarProps['configuration'];
  getEditorTranslation: (key: string) => string;
}>();

const emit = defineEmits<{
  'update:headerBgColor': [color: string];
  'update:iconColor': [color: string];
  'update:paddingTop': [value: number];
  'update:paddingBottom': [value: number];
  'update:paddingLeft': [value: number];
  'update:paddingRight': [value: number];
}>();

const isOpen = defineModel<boolean>('open', { default: true });

const headerBgColor = computed({
  get: () => props.configuration.colors.headerBackgroundColor,
  set: (newColor: string) => {
    emit('update:headerBgColor', newColor);
  },
});

const iconColor = computed({
  get: () => props.configuration.colors.iconColor,
  set: (newColor: string) => {
    emit('update:iconColor', newColor);
  },
});

const paddingTop = computed({
  get: () => props.configuration.layout.paddingTop,
  set: (newValue: number) => {
    emit('update:paddingTop', newValue);
  },
});

const paddingBottom = computed({
  get: () => props.configuration.layout.paddingBottom,
  set: (newValue: number) => {
    emit('update:paddingBottom', newValue);
  },
});

const paddingLeft = computed({
  get: () => props.configuration.layout.paddingLeft,
  set: (newValue: number) => {
    emit('update:paddingLeft', newValue);
  },
});

const paddingRight = computed({
  get: () => props.configuration.layout.paddingRight,
  set: (newValue: number) => {
    emit('update:paddingRight', newValue);
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "layout-label": "Layout",
    "header-bg-color-label": "Header Background Color",
    "icon-color-label": "Icon Color",
    "padding-label": "Padding (px)"
  },
  "de": {
    "layout-label": "Layout",
    "header-bg-color-label": "Header Background Color",
    "icon-color-label": "Icon Color",
    "padding-label": "Padding (px)"
  }
}
</i18n>
