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
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      width="24px"
      :viewBox="getViewBox()"
      fill="currentColor"
    >
      <template v-if="getPaths()">
        <path v-if="typeof getPaths() === 'string'" :d="getPaths() as string" />
        <path v-for="(path, index) in getPaths()" v-else :key="index" :d="path" />
      </template>
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

const getViewBox = () => {
  const icon = icons[props.iconName];
  if (!icon) return '0 -960 960 960';

  if (typeof icon === 'object' && 'viewBox' in icon) {
    return icon.viewBox;
  }
  return '0 -960 960 960';
};

const getPaths = () => {
  const icon = icons[props.iconName];
  if (!icon) return null;

  if (typeof icon === 'string' || Array.isArray(icon)) {
    return icon;
  }
  return icon.paths;
};
</script>