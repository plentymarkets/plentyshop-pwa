<template>
  <div v-if="editingSectionIndex !== undefined && sections[editingSectionIndex]" class="space-y-0">
    <component :is="sectionForm" />
  </div>
</template>

<script setup lang="ts">
import type { UtilityBarSection } from './types';

defineProps<{
  sections: UtilityBarSection[];
  editingSectionIndex: number | undefined;
  sectionForm: unknown;
}>();
</script>
