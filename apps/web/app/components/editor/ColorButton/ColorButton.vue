<script setup lang="ts">
import { ref, computed, onBeforeUnmount } from 'vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void;
}>();

const open = ref(false);
const root = ref<HTMLElement | null>(null);

const style = computed(() => ({
  backgroundColor: props.modelValue || '#000000',
}));

function toggle() {
  open.value = !open.value;
}

function close() {
  open.value = false;
}

function onDocClick(e: MouseEvent) {
  if (!root.value?.contains(e.target as Node)) {
    close();
  }
}

document.addEventListener('mousedown', onDocClick);
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick);
});
</script>

<template>
  <div ref="root" class="relative inline-block">
    <div class="rte__color cursor-pointer" :style="style" @mousedown.stop @click.stop="toggle" />

    <!-- YOUR EXISTING PICKER -->
    <div v-if="open" class="absolute left-0 top-full z-50 mt-2" @mousedown.stop @click.stop>
      <color-picker-block
        :model-value="modelValue"
        with-hex-input
        with-rgb-input
        @update:model-value="emit('update:modelValue', $event)"
      />
    </div>
  </div>
</template>

<style scoped>
.rte__color {
  width: 32px;
  height: 32px;
  border: 1px solid #dee2e6;
}
</style>
