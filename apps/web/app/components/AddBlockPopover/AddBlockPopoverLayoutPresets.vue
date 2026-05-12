<template>
  <template v-if="showLayout && filteredPresets.length > 0">
    <div class="section-label">{{ getEditorTranslation('layout-preset') }}</div>
    <div class="grid grid-cols-3 gap-[5px]">
      <button
        v-for="preset in filteredPresets"
        :key="preset.label"
        class="px-1 pt-2 pb-[7px] rounded-[7px] border border-[#e8e8e8] bg-white cursor-pointer flex flex-col items-center gap-[5px] hover:bg-[#f4f8ff] hover:border-[#b8ccf8] transition-all duration-[120ms]"
        @click="pickPreset(preset.spans)"
      >
        <div class="flex gap-[2px] w-full h-[10px]">
          <div
            v-for="(span, i) in preset.spans"
            :key="i"
            class="h-full rounded-[2px]"
            :style="{ flex: span, background: 'rgba(29,94,199,0.18)', border: '1px dashed rgba(29,94,199,0.5)' }"
          />
        </div>
        <span class="text-[10px] text-[#666]">{{ preset.label }}</span>
      </button>
    </div>
  </template>
</template>

<script setup lang="ts">
import { LAYOUT_PRESETS } from './types';

const { activeFilters, searchQuery, popoverState, closeAddBlockPopover } = useAddBlockPopover();
const { insertCustomBlock } = useBlockManager();

const showLayout = computed(() => activeFilters.value.length === 0 || activeFilters.value.includes('layout'));

const filteredPresets = computed(() =>
  LAYOUT_PRESETS.filter(
    (p) => !searchQuery.value || p.label.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
);

const pickPreset = (spans: readonly number[]) => {
  if (!popoverState.value) return;
  const { targetUuid: uuid, position } = popoverState.value;
  closeAddBlockPopover();
  insertCustomBlock(createMultiGridBlock(spans) as never, uuid, position);
};
</script>

<style scoped>
.section-label {
  @apply text-[9px] text-[#bbb] font-bold tracking-[0.1em] mb-2 pl-0.5 uppercase;
}
</style>

<i18n lang="json">
{
  "en": { "layout-preset": "Layout Presets" },
  "de": { "layout-preset": "Layout-Vorlagen" }
}
</i18n>
