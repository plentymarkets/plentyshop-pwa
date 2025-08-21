<template>
  <div class="flex w-full max-w-4xl mx-auto">
    <div
      v-if="drawerOpen && isActiveColumn"
      class="h-[196px] flex-1 border-2 border-dashed border-sky-400 bg-sky-50 p-6 flex flex-col items-center justify-center text-center"
    >
      <p class="font-semibold text-gray-800">Block will be placed here</p>
      <p class="text-sm text-gray-500">Choose one from templates</p>
    </div>
    <div
      v-else
      class="h-[196px] flex-1 border-2 border-dashed border-gray-400 bg-gray-50 p-6 flex flex-col items-center justify-center text-center cursor-pointer"
      @click.stop="addBlockToColumn()"
    >
      <span class="text-xl font-bold text-gray-700"><SfIconAdd class="cursor-pointer text-xl" /></span>
      <p class="font-semibold text-gray-800">Add block</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
const { columnUuid } = defineProps<{ columnUuid: string }>();
const { updateMultigridColumnUuid, setActiveColumnUuid, activeColumnUuid } = useBlockManager();
const { openDrawerWithView, drawerOpen } = useSiteConfiguration();

const isActiveColumn = computed(() => activeColumnUuid.value === columnUuid);

const addBlockToColumn = () => {
  updateMultigridColumnUuid(columnUuid);
  setActiveColumnUuid(columnUuid);
  openDrawerWithView('blocksList');
};
</script>
