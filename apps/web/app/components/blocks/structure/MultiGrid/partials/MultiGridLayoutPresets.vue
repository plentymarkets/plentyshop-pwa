<template>
  <div class="mb-3.5">
    <div class="text-[10px] text-[#b8b8b8] font-bold tracking-[0.07em] mb-2">LAYOUT PRESET</div>
    <div class="grid grid-cols-3 gap-[5px]">
      <button
        v-for="preset in presets"
        :key="preset.label"
        type="button"
        class="flex flex-col items-center gap-[5px] p-2 pb-[7px] rounded-[7px] border border-[#e8e8e8] bg-white cursor-pointer transition-all duration-100 hover:bg-[#f4f8ff] hover:border-[#b8ccf8]"
        @click="$emit('apply', preset.spans)"
      >
        <div class="flex gap-0.5 w-full h-[9px]">
          <div
            v-for="(span, i) in preset.spans"
            :key="i"
            class="h-full rounded-sm"
            :style="{
              flex: span,
              backgroundColor: presetColors[i % presetColors.length] + '90',
            }"
          />
        </div>
        <span class="text-[10px] text-[#666]">{{ preset.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  apply: [spans: number[]];
}>();

const presetColors = ['#4285F4', '#34A853', '#9C59D1', '#F4791F'];

const presets = [
  { label: '1 Col', spans: [12] },
  { label: '2 Equal', spans: [6, 6] },
  { label: 'Sidebar L', spans: [3, 9] },
  { label: 'Sidebar R', spans: [9, 3] },
  { label: '3 Equal', spans: [4, 4, 4] },
  { label: '4 Equal', spans: [3, 3, 3, 3] },
];
</script>
