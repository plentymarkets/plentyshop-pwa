<template>
  <div
    class="w-[34px] h-[19px] rounded-[10px] relative cursor-pointer flex-shrink-0 transition-colors duration-150"
    :class="modelValue ? 'bg-[#1D5EC7]' : 'bg-[#d0d0d0]'"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <div
      class="absolute w-[15px] h-[15px] rounded-full bg-white top-[2px] transition-[left] duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.18)]"
      :style="{ left: modelValue ? '17px' : '2px' }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: boolean;
}>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>
