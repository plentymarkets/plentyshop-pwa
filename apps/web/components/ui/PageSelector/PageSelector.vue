<template>
  <SfTooltip :label="pageLabel" placement="bottom" :show-arrow="true">
    <div class="page-selector relative flex items-center space-x-1 md:space-x-2">
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
  </SfTooltip>
</template>

<script setup lang="ts">
import { SfIconHome, SfIconExpandMore, SfTooltip } from '@storefront-ui/vue';
const { pageMeta } = usePageMeta();
const currentPageName = ref('Homepage');
const currentPageIcon = ref('home');
const isOpen = ref(false);
const toggleDropdown = () => (isOpen.value = !isOpen.value);
const handlePageSelected = ({ name, icon }: { name: string; icon: string }) => {
  isOpen.value = false;
  currentPageName.value = name;
  currentPageIcon.value = icon;
};

const pageLabel = 'Quickly search and jump to pages for editing';

const closeDropdown = () => {
  isOpen.value = false;
};
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement;
  if (!target.closest('.page-selector') && !target.closest('.page-search')) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});
</script>
