<template>
  <div v-if="editingSectionIndex !== undefined && sections[editingSectionIndex] && sectionForm" class="space-y-0">
    <component :is="sectionForm" :uuid="uuid" />
  </div>
</template>

<script setup lang="ts">
import type { UtilityBarSection } from '../types';

defineProps<{
  sections: UtilityBarSection[];
  editingSectionIndex: number | undefined;
  uuid?: string;
  sectionForm: unknown;
}>();
</script>
