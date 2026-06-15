<template>
  <div class="flex items-center gap-1.5 flex-shrink-0">
    <div class="relative inline-block z-toast">
      <SfDropdown v-model="isBlockTypeOpen" placement="bottom-start" @update:model-value="onBlockTypeDropdownToggle">
        <template #trigger>
          <button
            class="flex h-8 w-[96px] items-center justify-between rounded px-2 text-sm font-bold hover:bg-gray-100"
            data-testid="rte-heading-select"
            type="button"
            @click="onBlockTypeTriggerClick"
            @mousedown.prevent
          >
            <span>{{ selectedBlockTypeLabel }}</span>

            <svg
              :class="{ 'rotate-180': isBlockTypeOpen }"
              aria-hidden="true"
              class="h-4 w-4 shrink-0 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clip-rule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                fill-rule="evenodd"
              />
            </svg>
          </button>
        </template>

        <ul
          aria-label="Text style"
          class="-mt-1 z-popover w-[96px] rounded border border-gray-200 bg-white py-1 shadow-lg"
          data-testid="rte-heading-options"
          role="listbox"
          @click.stop
        >
          <li
            v-for="option in blockTypeOptions"
            :key="option.value"
            :aria-selected="option.value === currentBlockType"
            role="option"
          >
            <button
              :class="{ 'bg-gray-100 font-semibold': option.value === currentBlockType }"
              :data-testid="`rte-heading-option-${option.value}`"
              class="block w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              type="button"
              @click="selectBlockType(option.value)"
              @mousedown.prevent
            >
              {{ option.label }}
            </button>
          </li>
        </ul>
      </SfDropdown>
    </div>

    <div class="relative inline-block z-toast">
      <SfDropdown v-model="isFontSizeOpen" placement="bottom-start" @update:model-value="onFontSizeDropdownToggle">
        <template #trigger>
          <button
            class="flex h-8 w-[84px] items-center justify-between rounded px-2 text-sm font-bold hover:bg-gray-100"
            data-testid="rte-font-size-select"
            type="button"
            @click="onFontSizeTriggerClick"
            @mousedown.prevent
          >
            <span>{{ selectedFontSizeLabel }}</span>

            <svg
              :class="{ 'rotate-180': isFontSizeOpen }"
              aria-hidden="true"
              class="h-4 w-4 shrink-0 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clip-rule="evenodd"
                d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
                fill-rule="evenodd"
              />
            </svg>
          </button>
        </template>

        <ul
          aria-label="Font size"
          class="-mt-1 z-popover max-h-56 w-[84px] overflow-y-auto rounded border border-gray-200 bg-white py-1 shadow-lg"
          data-testid="rte-font-size-options"
          role="listbox"
          @click.stop
        >
          <li
            v-for="option in fontSizeOptions"
            :key="option.value"
            :aria-selected="option.value === effectiveFontSize"
            role="option"
          >
            <button
              :class="{ 'bg-gray-100 font-semibold': option.value === effectiveFontSize }"
              :data-testid="`rte-font-size-option-${option.value}`"
              class="block w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              type="button"
              @click="selectFontSize(option.value)"
              @mousedown.prevent
            >
              {{ option.label }}
            </button>
          </li>
        </ul>
      </SfDropdown>
    </div>
  </div>

  <EditorRichTextEditorMenuButton :active="isActive('bold')" icon-name="bold" @click="cmd('toggleBold')" />
  <EditorRichTextEditorMenuButton :active="isActive('italic')" icon-name="italic" @click="cmd('toggleItalic')" />
  <EditorRichTextEditorMenuButton
    :active="isActive('underline')"
    icon-name="underline"
    @click="cmd('toggleUnderline')"
  />
  <EditorRichTextEditorMenuButton
    :active="isActive('link')"
    data-testid="rte-link-button"
    icon-name="link"
    @click="toggleLink"
  />

  <EditorRichTextEditorMenuButton
    v-if="showPropertiesButton && onOpenPropertiesModal"
    :title="'Insert property'"
    data-testid="rte-properties-button"
    icon-name="add"
    @click="handleOpenPropertiesModal"
  />

  <EditorRichTextEditorIconEmojiPicker @select-icon="insertIcon" @select-emoji="insertEmoji" />

  <EditorColorPicker
    :model-value="textColor"
    align="right"
    data-testid="rte-font-color"
    @update:model-value="setFontColor($event)"
  >
    <template #trigger="{ color, toggle }">
      <button
        class="flex flex-col items-center gap-1 cursor-pointer p-1 hover:bg-gray-100 rounded"
        type="button"
        @click="toggle"
      >
        <svg fill="#062633" height="24px" viewBox="0 -960 960 960" width="24px" xmlns="http://www.w3.org/2000/svg">
          <path d="m246-160 176-464h116l176 464h-117l-38-112H401l-38 112H246Zm176-203h116l-56-166h-4l-56 166Z" />
        </svg>
        <div :style="{ backgroundColor: color }" class="w-6 h-1 rounded" />
      </button>
    </template>
  </EditorColorPicker>
</template>
<script lang="ts" setup>
import { SfDropdown } from '@storefront-ui/vue';
import type { RteCommand } from '~/composables/useRichTextEditor/types';

const props = defineProps<{
  cmd: (name: RteCommand) => void;
  isActive: (name: string) => boolean;
  currentBlockType: RteBlockType;
  onFontSizeChange: (value: string) => void;
  currentFontSize: string;
  onTextSizeChange: (value: string) => void;
  textColor: string;
  setFontColor: (color: string) => void;
  toggleLink: () => void;
  insertIcon: (name: string) => void;
  insertEmoji: (name: string) => void;
  showPropertiesButton?: boolean;
  onOpenPropertiesModal?: () => void;
}>();

const isBlockTypeOpen = ref(false);
const isFontSizeOpen = ref(false);

const blockTypeOptions = [
  { value: 'paragraph', label: 'Normal' },
  { value: 'h1', label: 'H1' },
  { value: 'h2', label: 'H2' },
  { value: 'h3', label: 'H3' },
  { value: 'h4', label: 'H4' },
  { value: 'h5', label: 'H5' },
  { value: 'h6', label: 'H6' },
];

const fontSizeOptions = [
  { value: '0.5rem', label: '8px' },
  { value: '0.625rem', label: '10px' },
  { value: '0.75rem', label: '12px' },
  { value: '0.875rem', label: '14px' },
  { value: '1rem', label: '16px' },
  { value: '1.125rem', label: '18px' },
  { value: '1.25rem', label: '20px' },
  { value: '1.5rem', label: '24px' },
  { value: '1.875rem', label: '30px' },
  { value: '2.25rem', label: '36px' },
  { value: '3rem', label: '48px' },
  { value: '3.75rem', label: '60px' },
  { value: '4.5rem', label: '72px' },
];

const headingFontSizeMap: Record<string, string> = {
  paragraph: '1rem',
  h1: '3.75rem',
  h2: '1.5rem',
  h3: '1.25rem',
  h4: '1.125rem',
  h5: '1rem',
  h6: '0.875rem',
};

const selectedBlockTypeLabel = computed(() => {
  return blockTypeOptions.find((option) => option.value === props.currentBlockType)?.label ?? 'Normal';
});

const effectiveFontSize = computed(() => {
  return props.currentFontSize || headingFontSizeMap[props.currentBlockType] || '1rem';
});

const selectedFontSizeLabel = computed(() => {
  return fontSizeOptions.find((option) => option.value === effectiveFontSize.value)?.label ?? '16px';
});
const onBlockTypeTriggerClick = () => {
  isBlockTypeOpen.value = !isBlockTypeOpen.value;
};

const onFontSizeTriggerClick = () => {
  isFontSizeOpen.value = !isFontSizeOpen.value;
};

const onBlockTypeDropdownToggle = (open: boolean) => {
  isBlockTypeOpen.value = open;
};

const onFontSizeDropdownToggle = (open: boolean) => {
  isFontSizeOpen.value = open;
};
const selectBlockType = (value: string) => {
  if (value === props.currentBlockType) {
    isBlockTypeOpen.value = false;
    return;
  }
  props.onFontSizeChange(value);

  const defaultFontSize = headingFontSizeMap[value];
  if (defaultFontSize) {
    props.onTextSizeChange(defaultFontSize);
  }

  isBlockTypeOpen.value = false;
};

const selectFontSize = (value: string) => {
  props.onTextSizeChange(value);
  isFontSizeOpen.value = false;
};

const handleOpenPropertiesModal = () => {
  if (props.onOpenPropertiesModal) {
    props.onOpenPropertiesModal();
  }
};
</script>
