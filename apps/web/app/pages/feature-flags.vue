<template>
  <div class="mx-auto max-w-3xl p-8 font-mono text-sm">
    <h1 class="mb-6 text-2xl font-bold">Feature Flags - Debug</h1>

    <section class="mb-6 rounded border p-4">
      <h2 class="mb-2 font-semibold uppercase tracking-wide text-gray-500">SDK Status</h2>
      <div class="flex items-center gap-2">
        <span :class="flagsReady ? 'text-green-600' : 'text-yellow-600'">
          {{ flagsReady ? 'Ready' : 'Not ready' }}
        </span>
        <span v-if="flagsError" class="text-red-600">⚠ Error</span>
      </div>
    </section>

    <section class="mb-6 rounded border p-4">
      <h2 class="mb-2 font-semibold uppercase tracking-wide text-gray-500">SSR / Hydrated Flags</h2>
      <p v-if="!ssrFlagKeys.length" class="text-gray-400 italic">
        No flags - set UNLEASH_MOCK_FLAGS or UNLEASH_URL in .env
      </p>
      <table v-else class="w-full">
        <thead>
          <tr class="text-left text-xs text-gray-400">
            <th class="pb-1 pr-4">Flag name</th>
            <th class="pb-1">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="name in ssrFlagKeys" :key="name">
            <td class="pr-4 py-0.5">{{ name }}</td>
            <td :class="ssrFlags[name] ? 'text-green-600' : 'text-red-500'">
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
        <button class="rounded bg-gray-800 px-4 py-1 text-white hover:bg-gray-700" @click="probeFlag">Probe</button>
      </div>

      <div v-if="probedFlags.length" class="mt-4 space-y-2">
        <div
          v-for="entry in probedFlags"
          :key="entry.name"
          class="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
        >
          <span>{{ entry.name }}</span>
          <span :class="entry.enabled ? 'text-green-600' : 'text-red-500'">
            {{ entry.enabled ? 'enabled' : 'disabled' }}
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
import type { UnleashFlagsState } from '~/plugins/06.unleash.server';

definePageMeta({ layout: false });

if (!import.meta.dev) await navigateTo('/');

const { flagsReady, flagsError } = useFeatureFlag();
const ssrFlags = useState<UnleashFlagsState>('unleash-flags', () => ({}));
const ssrFlagKeys = computed(() => Object.keys(ssrFlags.value).sort());
const inputFlag = ref('');
const probedFlags = ref<{ name: string; enabled: boolean }[]>([]);

function probeFlag() {
  const name = inputFlag.value.trim();
  if (!name) return;

  // Read directly from ssrFlags — avoids calling SDK composables outside setup
  const enabled = ssrFlags.value[name] ?? false;
  const existing = probedFlags.value.findIndex((f) => f.name === name);
  if (existing >= 0) {
    const entry = probedFlags.value[existing];
    if (entry) entry.enabled = enabled;
  } else {
    probedFlags.value.push({ name, enabled });
  }

  inputFlag.value = '';
}
</script>
