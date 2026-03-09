<template>
  <UiAccordionItem
    v-model="expandedColors"
    summary-active-class="bg-neutral-100"
    summary-class="w-full hover:bg-neutral-100 px-4 py-5 flex justify-between items-center select-none border-b"
  >
    <template #summary>
      <h2>{{ getEditorTranslation('colors-label') }}</h2>
    </template>
    <div class="py-2 px-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('background-color-label') }}</UiFormLabel>
      <EditorColorPicker v-model="editingBackgroundColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <SfInput v-model="editingBackgroundColor" type="text">
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
    <div class="py-2 px-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('icon-color-label') }}</UiFormLabel>
      <EditorColorPicker v-model="editingIconColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <SfInput v-model="editingIconColor" type="text">
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
  </UiAccordionItem>
</template>

<script setup lang="ts">
import type { HeaderProps, HeaderFormProps } from './types';
import { SfInput } from '@storefront-ui/vue';

const props = defineProps<HeaderFormProps>();

const { blockUuid } = useSiteConfiguration();
const { data } = useBlockTemplates('header', 'header', useNuxtApp().$i18n.locale.value);
const { findOrDeleteBlockByUuid } = useBlockManager();
const expandedColors = ref(true);

const block = computed(() => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as HeaderProps);

const editingBackgroundColor = computed({
  get: () => block.value.content?.backgroundColor ?? '',
  set: (val) => {
    if (block.value.content) block.value.content.backgroundColor = val;
  },
});

const editingIconColor = computed({
  get: () => block.value.content?.iconColor ?? '',
  set: (val) => {
    if (block.value.content) block.value.content.iconColor = val;
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "colors-label": "Colors",
    "background-color-label": "Background color",
    "icon-color-label": "Icon color"
  },
  "de": {
    "colors-label": "Farben",
    "background-color-label": "Hintergrundfarbe",
    "icon-color-label": "Icon-Farbe"
  }
}
</i18n>
