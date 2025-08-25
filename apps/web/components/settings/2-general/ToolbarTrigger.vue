<template>
  <SfTooltip :label="settingsLabel" placement="right" class="inline-grid" :show-arrow="true">
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
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfTooltip } from '@storefront-ui/vue';

import gearWhite from 'assets/icons/paths/gear-white.svg';
import gearBlack from 'assets/icons/paths/gear-black.svg';

const settingsLabel = 'Global configuration: manage cross-store settings and general options.';

defineProps({
  active: Boolean,
});
</script>
