<template>
  <section
    class="flex flex-col"
    :class="!isFirst && 'border-t border-editor-border pt-3.5'"
    :data-testid="`toc-section-${section.id}`"
  >
    <header class="flex items-center justify-between px-1 pt-0.5">
      <div class="flex items-center gap-2.5 min-w-0">
        <component :is="sectionIcons[section.id]" class="w-6 h-6 flex-none text-editor-text-default" />
        <span class="text-sm font-bold tracking-tight">{{ section.label }}</span>
      </div>
      <div class="flex items-center gap-1.5 flex-none">
        <template v-if="section.id === 'content'">
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center border border-editor-border text-editor-text-default hover:bg-editor-surface transition-colors"
            data-testid="toc-copy-page-template"
            :title="getEditorTranslation('copy-page-content')"
            :aria-label="getEditorTranslation('copy-page-content')"
            @click="copyPageBlocks"
          >
            <CopyIcon class="w-4 h-4" />
          </button>
          <button
            type="button"
            class="w-7 h-7 rounded-md flex items-center justify-center border border-editor-border text-editor-text-default hover:bg-editor-surface transition-colors"
            data-testid="toc-paste-page-template"
            :title="getEditorTranslation('paste-page-content')"
            :aria-label="getEditorTranslation('paste-page-content')"
            @click="requestPaste"
          >
            <PasteIcon class="w-4 h-4" />
          </button>
        </template>
        <button
          type="button"
          class="w-7 h-7 rounded-md flex items-center justify-center border border-editor-accent/40 text-editor-accent hover:bg-editor-accent/[4%] transition-colors"
          :data-testid="`toc-add-${section.id}-inline`"
          :title="getEditorTranslation('add-to-section', { section: section.label })"
          :aria-label="getEditorTranslation('add-to-section', { section: section.label })"
          @click="addAtTopForSection($event, section)"
        >
          <SfIconAdd size="xs" />
        </button>
      </div>
    </header>

    <draggable
      v-if="section.elements.length"
      v-model="draggableBlocks"
      :item-key="getBlockKey"
      handle=".toc-drag-handle"
      ghost-class="toc-drag-ghost"
      tag="div"
      :move="section.canMove"
      @start="handleDragStart"
      @end="handleDragEnd"
      @change="handleChange"
    >
      <template #item="{ element: block, index }">
        <div>
          <TableOfContentsInsertBlockLine v-if="index === 0" :block="block" is-top />
          <TableOfContentsItem :item="blockToFlatBlock(block)" />
          <TableOfContentsInsertBlockLine v-if="index < section.elements.length - 1" :block="block" />
        </div>
      </template>
    </draggable>
    <div v-else class="py-3 px-2 text-xs text-editor-text-muted text-center">
      {{ getEditorTranslation('empty') }}
    </div>

    <div class="pt-2 pb-1 px-0.5">
      <button
        type="button"
        class="w-full py-1.5 rounded-md border border-editor-accent/40 flex items-center justify-center gap-1.5 text-xs text-editor-accent hover:bg-editor-accent/[4%] transition-colors"
        :data-testid="section.addTestId"
        @click="addAtBottomForSection($event, section)"
      >
        <SfIconAdd size="xs" />
        <span>{{ getEditorTranslation('add-to-section', { section: section.label }) }}</span>
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import draggable from 'vuedraggable/src/vuedraggable';
import type { Block } from '@plentymarkets/shop-api';
import type { DragEvent } from '~/components/EditableBlocks/types';
import type { TocSection } from './types';
import HeaderSectionIcon from './icons/HeaderSectionIcon.vue';
import ContentSectionIcon from './icons/ContentSectionIcon.vue';
import FooterSectionIcon from './icons/FooterSectionIcon.vue';
import CopyIcon from './icons/CopyIcon.vue';
import PasteIcon from './icons/PasteIcon.vue';

const props = defineProps<{ section: TocSection; isFirst: boolean }>();

const { blockToFlatBlock, addAtTopForSection, addAtBottomForSection, handleSectionDragChange } = useTableOfContents();
const { handleDragStart, handleDragEnd } = useBlockManager();
const { copyPageBlocks, requestPaste } = useBlockClipboard();

const sectionIcons = {
  header: HeaderSectionIcon,
  content: ContentSectionIcon,
  footer: FooterSectionIcon,
};

const getBlockKey = (block: Block) => block.meta.uuid;

const draggableBlocks = computed({
  get: () => props.section.elements,
  set: (next: Block[]) => props.section.setOrder(next),
});

const handleChange = (evt: DragEvent) => handleSectionDragChange(props.section, evt);
</script>

<i18n lang="json">
{
  "en": {
    "empty": "No blocks in this section.",
    "add-to-section": "Add to {section}",
    "copy-page-content": "Copy page content",
    "paste-page-content": "Paste page content"
  },
  "de": {
    "empty": "No blocks in this section.",
    "add-to-section": "Add to {section}",
    "copy-page-content": "Copy page content",
    "paste-page-content": "Paste page content"
  }
}
</i18n>
