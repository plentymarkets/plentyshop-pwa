<template>
  <div class="flex-none px-6 py-4 border-b border-editor-border flex flex-col gap-2.5">
    <div class="flex gap-1.5">
      <button
        v-for="option in presets"
        :key="option.key"
        type="button"
        class="flex-1 px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap"
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
    <div>
      <button
        type="button"
        class="flex w-full items-center justify-between rounded-full border px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap"
        :class="
          preset === 'custom'
            ? 'border-editor-button bg-editor-button/10 text-editor-button'
            : 'border-editor-border bg-white text-editor-text-default hover:border-editor-button hover:text-editor-button'
        "
        data-testid="version-history-custom-range-toggle"
        :aria-expanded="preset === 'custom'"
        @click="toggleCustomRange"
      >
        <span>{{ getEditorTranslation('preset-custom') }}</span>
        <SfIconExpandMore class="transition-transform" :class="{ 'rotate-180': preset === 'custom' }" size="sm" />
      </button>
    </div>
    <div v-if="preset === 'custom'" class="flex items-center gap-2 pt-0.5">
      <input
        type="date"
        aria-label="From date"
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
import { SfIconExpandMore } from '@storefront-ui/vue';
import type { SnapshotDatePreset } from '~/composables/useBlockSnapshots/types';

const { preset, dateFrom, dateTo, setPreset, setDateFrom, setDateTo } = useBlockSnapshots();

const presets: { key: SnapshotDatePreset; label: string }[] = [
  { key: 'all', label: getEditorTranslation('preset-all') },
  { key: '1d', label: getEditorTranslation('preset-1d') },
  { key: '7d', label: getEditorTranslation('preset-7d') },
  { key: '30d', label: getEditorTranslation('preset-30d') },
];

const toggleCustomRange = () => {
  setPreset(preset.value === 'custom' ? 'all' : 'custom');
};
</script>

<i18n lang="json">
{
  "en": {
    "preset-all": "All time",
    "preset-1d": "Last day",
    "preset-7d": "Last 7 days",
    "preset-30d": "Last 30 days",
    "preset-custom": "Custom range",
    "to-label": "to"
  },
  "de": {
    "preset-all": "All time",
    "preset-1d": "Last day",
    "preset-7d": "Last 7 days",
    "preset-30d": "Last 30 days",
    "preset-custom": "Custom range",
    "to-label": "to"
  }
}
</i18n>
