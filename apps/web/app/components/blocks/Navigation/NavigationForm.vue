<template>
  <UiAccordionItem
    v-model="layoutSettings"
    data-testid="layout-settings"
    summary-active-class="bg-neutral-100 border-t-0"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('layout-group-label') }}</h2>
    </template>

    <fieldset class="py-2">
      <legend class="text-sm font-medium text-black">{{ getEditorTranslation('text-align-label') }}</legend>

      <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
        <div
          for="text-align-left"
          data-testid="text-align-left"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': navigationBlock.text.textAlignment === 'left' }"
          @click="navigationBlock.text.textAlignment = 'left'"
        >
          <SfIconCheck :class="{ invisible: navigationBlock.text.textAlignment !== 'left' }" class="mr-1 w-[1.1rem]" />
          {{ getEditorTranslation('text-align-option-left-label') }}
        </div>

        <div
          for="text-align-center"
          data-testid="text-align-center"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm border-r"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': navigationBlock.text.textAlignment === 'center' }"
          @click="navigationBlock.text.textAlignment = 'center'"
        >
          <SfIconCheck
            :class="{ invisible: navigationBlock.text.textAlignment !== 'center' }"
            class="mr-1 w-[1.1rem]"
          />
          {{ getEditorTranslation('text-align-option-center-label') }}
        </div>

        <div
          for="text-align-right"
          data-testid="text-align-right"
          class="flex items-center justify-center w-1/3 px-4 py-2 cursor-pointer text-sm"
          :class="{ 'bg-gray-100 text-gray-900 font-semibold': navigationBlock.text.textAlignment === 'right' }"
          @click="navigationBlock.text.textAlignment = 'right'"
        >
          <SfIconCheck :class="{ invisible: navigationBlock.text.textAlignment !== 'right' }" class="mr-1 w-[1.1rem]" />
          {{ getEditorTranslation('text-align-option-right-label') }}
        </div>
      </div>
    </fieldset>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
      </div>
      <EditorColorPicker v-model="navigationBlock.color.backgroundColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <label>
            <SfInput v-model="navigationBlock.color.backgroundColor" type="text" data-testid="input-background-color">
              <template #suffix>
                <button
                  type="button"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                  :style="{ backgroundColor: color }"
                  :aria-label="getEditorTranslation('open-background-color-picker-label')"
                  @mousedown.stop
                  @click.stop="toggle"
                />
              </template>
            </SfInput>
          </label>
        </template>
      </EditorColorPicker>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('text-color-label') }}</UiFormLabel>
      </div>
      <EditorColorPicker v-model="navigationBlock.color.textColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <label>
            <SfInput v-model="navigationBlock.color.textColor" type="text" data-testid="input-text-color">
              <template #suffix>
                <button
                  type="button"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                  :style="{ backgroundColor: color }"
                  :aria-label="getEditorTranslation('open-text-color-picker-label')"
                  @mousedown.stop
                  @click.stop="toggle"
                />
              </template>
            </SfInput>
          </label>
        </template>
      </EditorColorPicker>
    </div>

    <div class="py-2">
      <div class="flex justify-between mb-2">
        <UiFormLabel>{{ getEditorTranslation('hover-background-color-label') }}</UiFormLabel>
      </div>
      <EditorColorPicker v-model="navigationBlock.color.hoverBackgroundColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <label>
            <SfInput
              v-model="navigationBlock.color.hoverBackgroundColor"
              type="text"
              data-testid="input-hover-background-color"
            >
              <template #suffix>
                <button
                  type="button"
                  class="border border-[#a0a0a0] rounded-lg cursor-pointer w-10 h-8"
                  :style="{ backgroundColor: color }"
                  :aria-label="getEditorTranslation('open-hover-background-color-picker-label')"
                  @mousedown.stop
                  @click.stop="toggle"
                />
              </template>
            </SfInput>
          </label>
        </template>
      </EditorColorPicker>
    </div>

    <div class="py-2">
      <UiFormLabel>{{ getEditorTranslation('padding-label') }}</UiFormLabel>
      <div class="grid grid-cols-4 gap-px rounded-md overflow-hidden border border-gray-300">
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowUpward /></span>
          <input
            v-model.number="navigationBlock.layout.paddingTop"
            type="number"
            class="w-8 text-center outline-none"
            data-testid="padding-top"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowDownward /></span>
          <input
            v-model.number="navigationBlock.layout.paddingBottom"
            type="number"
            class="w-8 text-center outline-none"
            data-testid="padding-bottom"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white border-r">
          <span><SfIconArrowBack /></span>
          <input
            v-model.number="navigationBlock.layout.paddingLeft"
            type="number"
            class="w-8 text-center outline-none"
            data-testid="padding-left"
          />
        </div>
        <div class="flex items-center justify-center gap-1 px-2 py-1 bg-white">
          <span><SfIconArrowForward /></span>
          <input
            v-model.number="navigationBlock.layout.paddingRight"
            type="number"
            class="w-8 text-center outline-none"
            data-testid="padding-right"
          />
        </div>
      </div>
    </div>
  </UiAccordionItem>
</template>

<script setup lang="ts">
import {
  SfIconArrowUpward,
  SfIconArrowDownward,
  SfIconArrowBack,
  SfIconArrowForward,
  SfInput,
  SfIconCheck,
} from '@storefront-ui/vue';

import type { NavigationFormProps, NavigationContent } from './types';
const props = defineProps<NavigationFormProps>();
const layoutSettings = ref(false);

const route = useRoute();
const { data } = useBlockTemplates(
  route?.meta?.identifier as string,
  route.meta.type as string,
  useNuxtApp().$i18n.locale.value,
);

const { blockUuid } = useSiteConfiguration();
const { findOrDeleteBlockByUuid } = useBlockManager();

const navigationBlock = computed<NavigationContent>(() => {
  const rawContent = findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value)?.content ?? {};
  const content = rawContent as Partial<NavigationContent>;

  if (!content.layout) content.layout = {};
  content.layout.paddingTop = content.layout.paddingTop ?? 0;
  content.layout.paddingBottom = content.layout.paddingBottom ?? 0;
  content.layout.paddingLeft = content.layout.paddingLeft ?? 0;
  content.layout.paddingRight = content.layout.paddingRight ?? 0;

  if (!content.text) content.text = {};
  content.text.textAlignment = content.text.textAlignment ?? 'left';

  if (!content.color) content.color = {};
  content.color.backgroundColor = content.color.backgroundColor ?? '';
  content.color.textColor = content.color.textColor ?? '';
  content.color.hoverBackgroundColor = content.color.hoverBackgroundColor ?? '';

  return content as NavigationContent;
});
</script>

<i18n lang="json">
{
  "en": {
    "text-color-label": "Text Color",
    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "layout-group-label": "Layout",
    "background-color-label": "Background Color",
    "hover-background-color-label": "Link Hover Color",
    "padding-label": "Padding",
    "open-background-color-picker-label": "Open background color picker",
    "open-text-color-picker-label": "Open text color picker",
    "open-hover-background-color-picker-label": "Open hover background color picker"
  },
  "de": {
    "text-color-label": "Text Color",
    "text-align-label": "Text alignment",
    "text-align-option-left-label": "Left",
    "text-align-option-center-label": "Center",
    "text-align-option-right-label": "Right",

    "layout-group-label": "Layout",
    "background-color-label": "Background Color",
    "hover-background-color-label": "Link Hover Color",
    "padding-label": "Padding",
    "open-background-color-picker-label": "Open background color picker",
    "open-text-color-picker-label": "Open text color picker",
    "open-hover-background-color-picker-label": "Open hover background color picker"
  }
}
</i18n>
