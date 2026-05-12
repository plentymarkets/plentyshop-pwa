<template>
  <template v-if="showLayout && filteredPresets.length > 0">
    <div class="section-label">{{ getEditorTranslation('layout-preset') }}</div>
    <div class="grid grid-cols-3 gap-[5px]">
      <button
        v-for="preset in filteredPresets"
        :key="preset.label"
        class="px-1 pt-2 pb-[7px] rounded-[7px] border border-editor-border bg-white cursor-pointer flex flex-col items-center gap-[5px] hover:bg-editor-toc-hover hover:border-editor-accent-border-hover transition-all duration-[120ms]"
        @click="pickPreset(preset.columnWidths)"
      >
        <div class="flex gap-[2px] w-full h-[10px]">
          <div
            v-for="(columnWidth, i) in preset.columnWidths"
            :key="i"
            class="h-full rounded-[2px] bg-editor-accent/[18%] border border-dashed border-editor-accent/50"
            :style="{ flex: columnWidth }"
          />
        </div>
        <span class="text-[10px] text-editor-text-subtle">{{ preset.label }}</span>
      </button>
    </div>
  </template>
</template>

<script setup lang="ts">
import { LAYOUT_PRESETS } from './types';

const { activeFilters, searchQuery, popoverState, closeAddBlockPopover, clearPendingCancel, consumePresetPick } =
  useAddBlockPopover();
const { insertCustomBlock } = useBlockManager();

const showLayout = computed(() => activeFilters.value.length === 0 || activeFilters.value.includes('layout'));

const filteredPresets = computed(() =>
  LAYOUT_PRESETS.filter(
    (preset) => !searchQuery.value || preset.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
);

const pickPreset = (columnWidths: readonly number[]) => {
  if (!popoverState.value) return;
  const { targetUuid: uuid, position } = popoverState.value;
  clearPendingCancel();
  const handled = consumePresetPick(columnWidths);
  closeAddBlockPopover();
  if (!handled) {
    insertCustomBlock(createMultiGridBlock(columnWidths) as never, uuid, position);
  }
};
</script>

<style scoped>
.section-label {
  @apply text-[9px] text-editor-text-ghost font-bold tracking-[0.1em] mb-2 pl-0.5 uppercase;
}
</style>

<i18n lang="json">
{
  "en": { "layout-preset": "Layout Presets" },
  "de": { "layout-preset": "Layout Presets" }
}
</i18n>
