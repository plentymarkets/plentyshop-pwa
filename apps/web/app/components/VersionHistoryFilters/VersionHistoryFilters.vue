<template>
  <div class="flex-none px-6 py-4 border-b border-editor-border flex flex-col gap-2.5">
    <div class="flex gap-1 flex-nowrap">
      <button
        v-for="option in presets"
        :key="option.key"
        type="button"
        class="px-2.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap"
        :class="
          preset === option.key
            ? 'border-editor-button bg-editor-button/10 text-editor-button'
            : 'border-editor-border bg-white text-editor-text-default'
        "
        :data-testid="`version-history-preset-${option.key}`"
        @click="setPreset(option.key)"
      >
        {{ option.label }}
      </button>
    </div>
    <div v-if="preset === 'custom'" class="flex items-center gap-2">
      <input
        type="date"
        class="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-editor-border text-editor-text-default"
        data-testid="version-history-date-from"
        :value="dateFrom"
        @change="setDateFrom(($event.target as HTMLInputElement).value)"
      />
      <span class="text-editor-text-muted text-2xs">{{ getEditorTranslation('to-label') }}</span>
      <input
        type="date"
        class="flex-1 text-xs px-2.5 py-1.5 rounded-md border border-editor-border text-editor-text-default"
        data-testid="version-history-date-to"
        :value="dateTo"
        @change="setDateTo(($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SnapshotDatePreset } from '~/composables/useBlockSnapshots/types';

const { preset, dateFrom, dateTo, setPreset, setDateFrom, setDateTo } = useBlockSnapshots();

const presets: { key: SnapshotDatePreset; label: string }[] = [
  { key: 'all', label: getEditorTranslation('preset-all') },
  { key: '7d', label: getEditorTranslation('preset-7d') },
  { key: '30d', label: getEditorTranslation('preset-30d') },
  { key: 'custom', label: getEditorTranslation('preset-custom') },
];
</script>

<i18n lang="json">
{
  "en": {
    "preset-all": "All time",
    "preset-7d": "Last 7 days",
    "preset-30d": "Last 30 days",
    "preset-custom": "Custom range",
    "to-label": "to"
  },
  "de": {
    "preset-all": "All time",
    "preset-7d": "Last 7 days",
    "preset-30d": "Last 30 days",
    "preset-custom": "Custom range",
    "to-label": "to"
  }
}
</i18n>
