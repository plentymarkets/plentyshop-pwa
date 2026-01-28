<script setup lang="ts">
const props = defineProps<{
  activeTab: 'shop' | 'picker';
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', v: 'shop' | 'picker'): void;
}>();

const setTab = (tab: 'shop' | 'picker') => {
  if (props.activeTab === tab) return;
  emit('update:activeTab', tab);
};
</script>

<template>
  <fieldset class="mb-3">
    <legend class="sr-only">Color source</legend>
    <div class="w-full inline-flex rounded-lg border border-gray-300 bg-white text-gray-700 overflow-hidden">
      <button
        type="button"
        class="flex items-center justify-center w-1/2 px-3 py-1 cursor-pointer text-xs border-r"
        :class="{
          'bg-gray-100 text-gray-900 font-semibold': activeTab === 'shop',
        }"
        @click="setTab('shop')"
      >
        Shop colors
      </button>
      <button
        type="button"
        class="flex items-center justify-center w-1/2 px-3 py-1 cursor-pointer text-xs"
        :class="{
          'bg-gray-100 text-gray-900 font-semibold': activeTab === 'picker',
        }"
        @click="setTab('picker')"
      >
        Color Picker
      </button>
    </div>
  </fieldset>
</template>
