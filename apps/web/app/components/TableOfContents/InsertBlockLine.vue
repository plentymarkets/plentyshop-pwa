<template>
  <div class="relative group py-2" @mouseenter="startHoverTimer" @mouseleave="handleMouseLeave">
    <transition
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-show="showLine" class="absolute flex items-center justify-center w-full top-[-50%]">
        <div class="absolute inset-y-1/2 left-0 right-0 border-t-2 border-editor-toc-selected" />
        <button
          class="relative w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 bg-editor-toc-selected text-white border-none hover:opacity-80 transition-opacity"
          :aria-label="getEditorTranslation('add-block-label')"
          @click="handleAddBlock"
        >
          <SfIconAdd class="w-4 h-4" />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import type { Block } from '@plentymarkets/shop-api';

interface Props {
  index: number;
  block: Block;
  isTop?: boolean;
}

const props = defineProps<Props>();

const { scrollIntoBlockView, togglePlaceholder, multigridColumnUuid } = useBlockManager();
const { openDrawerWithView } = useSiteConfiguration();

const showLine = ref(false);
let hoverTimeout: ReturnType<typeof setTimeout> | null = null;

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
