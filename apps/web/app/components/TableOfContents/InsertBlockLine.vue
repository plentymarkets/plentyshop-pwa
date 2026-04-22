<template>
  <div
    class="relative group py-1"
    @mouseenter="startHoverTimer"
    @mouseleave="handleMouseLeave"
    @focusin="handleFocusIn"
    @focusout="handleFocusOut"
  >
    <div class="absolute flex items-center justify-center w-full top-[-100%]">
      <div
        class="absolute inset-y-1/2 left-0 right-0 border-t-2 transition-opacity duration-200"
        :class="showLine ? 'border-editor-toc-selected opacity-100' : 'border-transparent opacity-0'"
      />
      <button
        ref="addBlockButton"
        class="relative w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-editor-toc-selected text-white border-2 border-white transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-editor-toc-selected"
        :class="showLine ? 'opacity-100' : 'opacity-0 pointer-events-none'"
        :aria-label="getEditorTranslation('add-block-label')"
        @click="handleAddBlock"
        @keydown.space.prevent="handleAddBlock"
        @keydown.enter="handleAddBlock"
      >
        <SfIconAdd class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import type { InsertBlockLineProps } from './types';

const props = defineProps<InsertBlockLineProps>();

const { scrollIntoBlockView, togglePlaceholder, multigridColumnUuid } = useBlockManager();
const { openDrawerWithView } = useSiteConfiguration();

const showLine = ref(false);
const addBlockButton = ref<HTMLButtonElement | null>(null);
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;
let isFocused = false;

const startHoverTimer = () => {
  if (!hoverTimeout) {
    hoverTimeout = setTimeout(() => {
      showLine.value = true;
      hoverTimeout = null;
    }, 500);
  }
};

const handleMouseLeave = () => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
    hoverTimeout = null;
  }

  if (!isFocused) {
    showLine.value = false;
  }
};

const handleFocusIn = () => {
  isFocused = true;
  showLine.value = true;
};

const handleFocusOut = () => {
  isFocused = false;
  showLine.value = false;
};

const handleAddBlock = () => {
  const position = props.isTop ? 'top' : 'bottom';
  togglePlaceholder(props.block.meta.uuid, position);
  openDrawerWithView('blocksList');
  multigridColumnUuid.value = null;
  scrollIntoBlockView(props.block, true, position);
};

onUnmounted(() => {
  if (hoverTimeout) {
    clearTimeout(hoverTimeout);
  }
});
</script>

<i18n lang="json">
{
  "en": {
    "add-block-label": "Add block"
  },
  "de": {
    "add-block-label": "Add block"
  }
}
</i18n>
