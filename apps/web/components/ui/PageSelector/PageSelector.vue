<template>
  <div
    class="relative flex items-center space-x-1 md:space-x-2"
    :class="{ 'opacity-40 cursor-not-allowed': isEditing || disableActions }"
  >
    <SfIconHome v-if="pageMeta.icon === 'home'" class="w-4 h-4 md:w-6 md:h-6" />
    <div class="relative flex items-center">
      <button
        :disabled="isEditing || disableActions"
        :class="{ 'opacity-40 cursor-not-allowed': isEditing || disableActions }"
        @click="toggleDropdown"
      >
        {{ pageMeta.name }}
      </button>

      <div class="flex items-center">
        <SfIconExpandMore class="w-4 h-4 md:w-6 md:h-6" />
      </div>
    </div>
  </div>
  <UiPageSearch v-if="isOpen" @close="toggleDropdown" @page-selected="handlePageSelected" />
</template>

<script setup lang="ts">
import { SfIconHome, SfIconExpandMore } from '@storefront-ui/vue';
const { pageMeta } = usePageMeta();
const currentPageName = ref('Homepage');
const currentPageIcon = ref('home');

const { isEditing, disableActions } = useEditor();
const isOpen = ref(false);

const handlePageSelected = ({ name, icon }: { name: string; icon: string }) => {
  isOpen.value = false;
  currentPageName.value = name;
  currentPageIcon.value = icon;
};
const toggleInProgress = ref(false);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

const toggleDropdown = (event?: MouseEvent) => {
  if (toggleInProgress.value) return;
  toggleInProgress.value = true;

  if (event) event.stopPropagation();

  isOpen.value = !isOpen.value;

  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(() => {
    toggleInProgress.value = false;
    timeoutId = null;
  }, 500);
};
</script>
