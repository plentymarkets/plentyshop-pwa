<template>
  <EditorFormPanel v-model="expandedTextSettings" :title="getEditorTranslation('text-label')">
    <div class="py-2 px-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('marquee-text-label') }}</UiFormLabel>
      <SfInput v-model="editingText" type="text" />
    </div>

    <div class="py-2 px-2">
      <UiFormLabel class="mb-1">{{ getEditorTranslation('speed-label') }}</UiFormLabel>
      <SfInput v-model.number="editingSpeed" type="number" min="1" max="60" />
    </div>
  </EditorFormPanel>

  <EditorFormPanel v-model="expandedColorSettings" :title="getEditorTranslation('colors-label')">
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
      <UiFormLabel class="mb-1">{{ getEditorTranslation('text-color-label') }}</UiFormLabel>
      <EditorColorPicker v-model="editingTextColor" class="w-full">
        <template #trigger="{ color, toggle }">
          <SfInput v-model="editingTextColor" type="text">
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
  </EditorFormPanel>
</template>

<script setup lang="ts">
import type { RetroMarqueeProps, RetroMarqueeFormProps } from './types';
import { SfInput } from '@storefront-ui/vue';

const props = defineProps<RetroMarqueeFormProps>();

const { blockUuid } = useSiteConfiguration();
const { allBlocks: data } = useBlocks();
const { findOrDeleteBlockByUuid } = useBlockManager();
const expandedTextSettings = ref(true);
const expandedColorSettings = ref(true);

const block = computed(
  () => (findOrDeleteBlockByUuid(data.value, props.uuid || blockUuid.value) || {}) as RetroMarqueeProps,
);

const editingText = computed({
  get: () => block.value.content.text ?? '',
  set: (val: string) => {
    block.value.content.text = val ?? '';
  },
});

const editingSpeed = computed({
  get: () => block.value.content.speed ?? 20,
  set: (val: number) => {
    block.value.content.speed = Number.isFinite(val) ? val : 20;
  },
});

const editingBackgroundColor = computed({
  get: () => block.value.content.backgroundColor,
  set: (val) => {
    block.value.content.backgroundColor = val;
  },
});

const editingTextColor = computed({
  get: () => block.value.content.textColor,
  set: (val) => {
    block.value.content.textColor = val;
  },
});
</script>

<i18n lang="json">
{
  "en": {
    "text-label": "Text",
    "marquee-text-label": "Marquee text",
    "speed-label": "Scroll duration (seconds)",
    "colors-label": "Colors",
    "background-color-label": "Background color",
    "text-color-label": "Text color"
  },
  "de": {
    "text-label": "Text",
    "marquee-text-label": "Lauftext",
    "speed-label": "Scroll-Dauer (Sekunden)",
    "colors-label": "Farben",
    "background-color-label": "Hintergrundfarbe",
    "text-color-label": "Textfarbe"
  }
}
</i18n>
