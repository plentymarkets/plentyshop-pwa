<template>
  <div class="flex items-center gap-2 pt-3 mt-3.5 border-t border-[#f0f0f0]">
    <span class="flex-1 text-xs text-[#555]">Column Gap</span>
    <div class="flex gap-[3px]">
      <button
        v-for="g in gapValues"
        :key="g.value"
        type="button"
        class="w-7 h-6 rounded-[5px] text-[10px] cursor-pointer transition-all duration-100"
        :class="
          modelValue === g.key
            ? 'border border-[#1D5EC7] bg-[#1D5EC715] text-[#1D5EC7] font-bold'
            : 'border border-[#e2e2e2] bg-white text-[#888]'
        "
        @click="$emit('update:modelValue', g.key)"
      >
        {{ g.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

defineEmits<{
  'update:modelValue': [value: string];
}>();

const gapValues = [
  { key: 'None', label: '0', value: 0 },
  { key: 'S', label: '4', value: 4 },
  { key: 'M', label: '8', value: 8 },
  { key: 'L', label: '12', value: 12 },
  { key: 'XL', label: '20', value: 20 },
];
</script>
