<template>
  <button
    type="button"
    class="editor-button relative py-2 flex justify-center"
    :class="{ 'bg-editor-button text-white rounded-md': active }"
    aria-label="Open general settings drawer"
    data-testid="open-general-settings-drawer"
  >
    <NuxtImg v-if="active" width="24" height="24px" :src="gearWhite" />
    <NuxtImg v-else width="24" height="24px" :src="gearBlack" />
  </button>
</template>

<script setup lang="ts">
import gearWhite from 'assets/icons/paths/gear-white.svg';
import gearBlack from 'assets/icons/paths/gear-black.svg';

defineProps({
  active: Boolean,
});
</script>
