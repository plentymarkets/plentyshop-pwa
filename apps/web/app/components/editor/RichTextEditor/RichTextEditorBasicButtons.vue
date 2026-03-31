<template>
  <div class="relative inline-block z-[500]">
    <SfDropdown v-model="isBlockTypeOpen" placement="bottom-start" @update:model-value="onBlockTypeDropdownToggle">
      <template #trigger>
        <button
          ref="blockTypeTriggerRef"
          type="button"
          data-testid="rte-heading-select"
          class="flex h-8 w-[96px] items-center justify-between rounded px-2 text-sm font-bold hover:bg-gray-100"
          @mousedown.prevent
          @click="onBlockTypeTriggerClick"
        >
          <span>{{ selectedBlockTypeLabel }}</span>

          <svg
            class="h-4 w-4 shrink-0 transition-transform"
            :class="{ 'rotate-180': isBlockTypeOpen }"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
            />
          </svg>
        </button>
      </template>

      <ul
        class="-mt-1 z-[300] w-[96px] rounded border border-gray-200 bg-white py-1 shadow-lg"
        role="listbox"
        aria-label="Text style"
        data-testid="rte-heading-options"
        @click.stop
      >
        <li
          v-for="option in blockTypeOptions"
          :key="option.value"
          role="option"
          :aria-selected="option.value === currentBlockType"
        >
          <button
            :data-testid="`rte-heading-option-${option.value}`"
            type="button"
            class="block w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100"
            :class="{ 'bg-gray-100 font-semibold': option.value === currentBlockType }"
            @mousedown.prevent
            @click="selectBlockType(option.value)"
          >
            {{ option.label }}
          </button>
        </li>
      </ul>
    </SfDropdown>
  </div>

  <div class="relative inline-block z-[500]">
    <SfDropdown v-model="isFontSizeOpen" placement="bottom-start" @update:model-value="onFontSizeDropdownToggle">
      <template #trigger>
        <button
          ref="fontSizeTriggerRef"
          type="button"
          data-testid="rte-font-size-select"
          class="flex h-8 w-[84px] items-center justify-between rounded px-2 text-sm font-bold hover:bg-gray-100"
          @mousedown.prevent
          @click="onFontSizeTriggerClick"
        >
          <span>{{ selectedFontSizeLabel }}</span>

          <svg
            class="h-4 w-4 shrink-0 transition-transform"
            :class="{ 'rotate-180': isFontSizeOpen }"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.168l3.71-3.938a.75.75 0 1 1 1.08 1.04l-4.25 4.51a.75.75 0 0 1-1.08 0l-4.25-4.51a.75.75 0 0 1 .02-1.06Z"
            />
          </svg>
        </button>
      </template>

      <ul
        class="-mt-1 z-[300] max-h-56 w-[84px] overflow-y-auto rounded border border-gray-200 bg-white py-1 shadow-lg"
        role="listbox"
        aria-label="Font size"
        data-testid="rte-font-size-options"
        @click.stop
      >
        <li
          v-for="option in fontSizeOptions"
          :key="option.value"
          role="option"
          :aria-selected="option.value === effectiveFontSize"
        >
          <button
            type="button"
            :data-testid="`rte-font-size-option-${option.value}`"
            class="block w-full px-2 py-1.5 text-left text-sm hover:bg-gray-100"
            :class="{ 'bg-gray-100 font-semibold': option.value === effectiveFontSize }"
            @mousedown.prevent
            @click="selectFontSize(option.value)"
          >
            {{ option.label }}
          </button>
        </li>
      </ul>
    </SfDropdown>
  </div>

  <EditorRichTextEditorMenuButton :active="isActive('bold')" icon-name="bold" @click="cmd('toggleBold')" />
  <EditorRichTextEditorMenuButton :active="isActive('italic')" icon-name="italic" @click="cmd('toggleItalic')" />
  <EditorRichTextEditorMenuButton
    :active="isActive('underline')"
    icon-name="underline"
    @click="cmd('toggleUnderline')"
  />
  <EditorRichTextEditorMenuButton
    data-testid="rte-link-button"
    :active="isActive('link')"
    icon-name="link"
    @click="toggleLink"
  />

  <EditorColorPicker
    data-testid="rte-font-color"
    :model-value="textColor"
    dropdown-align="top-editor"
    @update:model-value="setFontColor($event)"
  >
    <template #trigger="{ color, toggle }">
      <button
        type="button"
        class="flex flex-col items-center gap-1 cursor-pointer p-1 hover:bg-gray-100 rounded"
        @click="toggle"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#062633">
          <path d="m246-160 176-464h116l176 464h-117l-38-112H401l-38 112H246Zm176-203h116l-56-166h-4l-56 166Z" />
        </svg>
        <div class="w-6 h-1 rounded" :style="{ backgroundColor: color }" />
      </button>
    </template>
  </EditorColorPicker>
</template>
<script setup lang="ts">
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
}>();

const isBlockTypeOpen = ref(false);
const isFontSizeOpen = ref(false);

const blockTypeTriggerRef = ref<HTMLButtonElement | null>(null);
const fontSizeTriggerRef = ref<HTMLButtonElement | null>(null);

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
</script>
