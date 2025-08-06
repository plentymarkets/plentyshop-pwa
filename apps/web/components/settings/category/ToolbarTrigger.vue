<template>
  <button
    v-if="runtimeConfig.public.isDev"
    type="button"
    class="editor-button relative py-2 flex justify-center"
    :class="{ 'bg-editor-button text-white rounded-md': active }"
    aria-label="Open general settings drawer"
    data-testid="open-general-settings-drawer"
  >
    <NuxtImg v-if="active" width="24" height="24px" :src="whiteIcon" />
    <NuxtImg v-else width="24" height="24px" :src="blackIcon" />
  </button>
</template>

<script setup lang="ts">
import whiteIcon from 'assets/icons/paths/category-white.svg';
import blackIcon from 'assets/icons/paths/category-black.svg';
const runtimeConfig = useRuntimeConfig();

defineProps({
  active: Boolean,
});
</script>
