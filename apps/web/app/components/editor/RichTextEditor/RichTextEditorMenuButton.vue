<template>
  <button
    type="button"
    class="w-8 h-8 rounded inline-flex items-center justify-center text-sm cursor-pointer"
    :class="
      active
        ? 'bg-slate-800 border border-gray-300 text-white hover:bg-slate-700'
        : 'bg-transparent border border-transparent text-gray-800 hover:bg-gray-100'
    "
    @mousedown.prevent
  >
    <svg
      v-if="paths.length > 0"
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      width="24px"
      :viewBox="viewBox"
      fill="currentColor"
    >
      <path v-for="(path, index) in paths" :key="index" :d="path" />
    </svg>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { icons } from './icons';

const props = withDefaults(
  defineProps<{
    active?: boolean;
    iconName?: string;
  }>(),
  {
    active: false,
    iconName: '',
  },
);

const viewBox = computed(() => {
  const icon = icons[props.iconName];
  if (!icon) return '0 -960 960 960';

  return typeof icon === 'object' && 'viewBox' in icon
    ? icon.viewBox
    : '0 -960 960 960';
});

const paths = computed(() => {
  const icon = icons[props.iconName];
  if (!icon) return [];

  if (typeof icon === 'string') return [icon];
  if (Array.isArray(icon)) return icon;

  return Array.isArray(icon.paths) ? icon.paths : [icon.paths];
});
</script>