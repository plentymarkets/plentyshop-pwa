<template>
  <div class="relative flex items-center space-x-1 md:space-x-2">
    <SfIconHome v-if="pageMeta.icon === 'home'" class="w-4 h-4 md:w-6 md:h-6" />

    <div class="relative flex items-center">
      <button @click="toggleDropdown">
        {{ pageMeta.name }}
      </button>
      <div class="flex items-center">
        <SfIconExpandMore class="w-4 h-4 md:w-6 md:h-6" />
      </div>
    </div>
  </div>

  <UiPageSearch v-if="isOpen" @close="closeDropdown" @page-selected="handlePageSelected" />
</template>

<script setup lang="ts">
import { SfIconHome, SfIconExpandMore } from '@storefront-ui/vue';

const { pageMeta } = usePageMeta();
const isOpen = ref(false);

const toggleDropdown = (event: Event) => {
  event.stopPropagation();
  isOpen.value = !isOpen.value;
};

const closeDropdown = () => {
  setTimeout(() => {
    isOpen.value = false;
  }, 100);
};
const handlePageSelected = ({ name }: { name: string }) => {
  closeDropdown();
  pageMeta.value.name = name;
};
</script>
