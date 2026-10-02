<template>
  <div :class="['bg-red-600 text-white transition-opacity', !enabled && 'opacity-50']">
    <div class="flex items-center justify-between px-8 py-6">
      <div>
        <p class="text-sm font-medium uppercase tracking-widest">
          Limited time offer<span v-if="!enabled"> — paused</span>
        </p>
        <p class="mt-1 font-mono text-4xl font-bold tabular-nums">
          {{ pad(hours) }}h&nbsp;{{ pad(minutes) }}m&nbsp;{{ pad(seconds) }}s
        </p>
      </div>
      <button
        class="rounded-md border border-white px-4 py-2 text-sm font-medium transition-colors hover:bg-white hover:text-red-600"
        @click="reset"
      >
        Reset offer
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// useCountdown is auto-imported from the module via addImportsDir.
// The composable watches useExtensionEnabled internally:
//   - extension enabled  → timer runs, v-if shows the banner
//   - extension disabled → timer pauses, v-if hides the banner
const { hours, minutes, seconds, reset, enabled } = useCountdown();

const pad = (n: number) => String(n).padStart(2, '0');
</script>
