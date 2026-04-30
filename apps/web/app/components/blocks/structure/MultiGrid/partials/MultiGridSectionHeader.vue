<template>
  <div
    class="flex items-center cursor-pointer select-none border-t border-b px-3.5 py-2"
    :class="expanded ? 'bg-[#f7f7f7] border-[#ebebeb]' : 'bg-[#f7f7f7] border-[#ebebeb] border-b-transparent'"
    @click="$emit('toggle')"
  >
    <span class="flex-1 text-[11px] font-bold text-[#666] tracking-[0.05em] uppercase">{{ title }}</span>
    <svg
      width="10"
      height="6"
      viewBox="0 0 10 6"
      fill="none"
      class="transition-transform duration-150"
      :class="expanded ? '' : '-rotate-90'"
    >
      <path d="M1 1l4 4 4-4" stroke="#aaa" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  expanded: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>
