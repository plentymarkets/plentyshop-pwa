<template>
  <div class="py-2">
    <div v-if="loading && !modules.length" class="text-sm text-gray-400 px-1">
      {{ getEditorTranslation('loading') }}
    </div>
    <div v-else-if="!modules.length" class="text-sm text-gray-400 px-1">
      {{ getEditorTranslation('empty') }}
    </div>
    <div v-else class="flex flex-col gap-3">
      <div
        v-for="mod in modules"
        :key="mod.id"
        class="flex items-center justify-between"
      >
        <div class="flex flex-col">
          <span class="text-sm font-medium">{{ mod.id }}</span>
          <span v-if="mod.version" class="text-xs text-gray-400">v{{ mod.version }}</span>
        </div>
        <SfSwitch
          :model-value="mod.enabled !== false"
          :disabled="loading"
          class="checked:bg-editor-button checked:before:hover:bg-editor-button checked:border-gray-500 checked:hover:border:bg-gray-700 hover:border-gray-700 hover:before:bg-gray-700 checked:hover:bg-gray-300 checked:hover:border-gray-400"
          @update:model-value="(val) => toggleModule(mod.id, val === true)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfSwitch } from '@storefront-ui/vue';

const { modules, loading, fetchModules, toggleModule } = useModuleManifest();

onMounted(fetchModules);
</script>

<i18n lang="json">
{
  "en": {
    "loading": "Loading modules...",
    "empty": "No modules found."
  },
  "de": {
    "loading": "Module werden geladen...",
    "empty": "Keine Module gefunden."
  }
}
</i18n>
