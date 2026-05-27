<template>
  <div class="mx-auto max-w-3xl p-8 font-mono text-sm">
    <h1 class="mb-6 text-2xl font-bold">Unleash Feature Flags — Playground</h1>

    <section class="mb-6 rounded border p-4">
      <div class="flex items-center gap-3">
        <h2 class="font-semibold uppercase tracking-wide text-gray-500">SDK Status</h2>
        <span v-if="sdkStatus === 'mock'" class="text-gray-400">Mock mode — SDK disabled (no UNLEASH_URL set)</span>
        <span v-else-if="sdkStatus === 'error'" class="text-red-600">Error</span>
        <span v-else-if="sdkStatus === 'ready'" class="text-green-600">Ready</span>
        <span v-else class="text-yellow-600">Connecting…</span>
      </div>
    </section>

    <section class="mb-6 rounded border p-4">
      <h2 class="mb-2 font-semibold uppercase tracking-wide text-gray-500">SSR / Hydrated Flags</h2>
      <p v-if="!ssrFlagKeys.length" class="italic text-gray-400">
        No flags — set UNLEASH_MOCK_FLAGS or UNLEASH_URL in .env
      </p>

      <table v-else class="w-full">
        <thead>
          <tr class="text-left text-xs text-gray-400">
            <th class="pb-2 pr-4">Flag name</th>
            <th class="pb-2">Value</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="name in ssrFlagKeys" :key="name" class="border-b border-gray-200 last:border-b-0">
            <td class="py-1.5 pr-4">{{ name }}</td>
            <td class="py-1.5" :class="ssrFlags[name] ? 'text-green-600' : 'text-red-500'">
              {{ ssrFlags[name] ? 'enabled' : 'disabled' }}
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <section class="mb-6 rounded border p-4">
      <h2 class="mb-3 font-semibold uppercase tracking-wide text-gray-500">Live Flag Probe</h2>

      <div class="flex gap-2">
        <input
          v-model="inputFlag"
          placeholder="Enter flag name…"
          class="flex-1 rounded border px-3 py-1 text-sm"
          @keydown.enter="probeFlag"
        />
        <button class="rounded border border-gray-300 px-4 py-1 hover:bg-gray-100" @click="probeFlag">Probe</button>
      </div>

      <div v-if="probedFlags.length" class="mt-4 space-y-2">
        <div
          v-for="entry in probedFlags"
          :key="entry.name"
          class="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
        >
          <span>{{ entry.name }}</span>
          <span :class="entry.found ? (entry.enabled ? 'text-green-600' : 'text-red-500') : 'text-gray-400'">
            {{ entry.found ? (entry.enabled ? 'enabled' : 'disabled') : 'not found' }}
          </span>
        </div>
      </div>
    </section>

    <section class="rounded border p-4">
      <h2 class="mb-2 font-semibold uppercase tracking-wide text-gray-500">Raw useState Snapshot</h2>
      <pre class="overflow-auto rounded bg-gray-50 p-3 text-xs">{{ JSON.stringify(ssrFlags, null, 2) }}</pre>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useState, computed, ref, useHead, useRuntimeConfig, definePageMeta } from '#imports';
import { useFeatureFlag } from '../composables/useFeatureFlag';
import type { UnleashFlagsState } from '../types';

definePageMeta({ layout: false });

useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }] });

const { flagsReady, flagsError } = useFeatureFlag();
const { public: runtimePublic } = useRuntimeConfig();
const sdkConfigured = !!(runtimePublic.unleash as { url: string }).url;
const ssrFlags = useState<UnleashFlagsState>('unleash-flags', () => ({}));
const ssrFlagKeys = computed(() => Object.keys(ssrFlags.value).sort());
const sdkStatus = computed(() => {
  if (!sdkConfigured) return 'mock';
  if (flagsError.value) return 'error';
  if (flagsReady.value) return 'ready';
  return 'connecting';
});

const inputFlag = ref('');
const probedFlags = ref<{ name: string; enabled: boolean; found: boolean }[]>([]);

const probeFlag = () => {
  const name = inputFlag.value.trim();
  if (!name) return;

  const found = name in ssrFlags.value;
  const enabled = found ? (ssrFlags.value[name] ?? false) : false;
  const existing = probedFlags.value.find((f) => f.name === name);
  existing ? Object.assign(existing, { enabled, found }) : probedFlags.value.push({ name, enabled, found });

  inputFlag.value = '';
};
</script>
