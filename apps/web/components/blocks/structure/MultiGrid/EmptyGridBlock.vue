<template>
  <div v-if="$isPreview" class="flex w-full max-w-4xl mx-auto">
    <div
      v-if="drawerOpen && isActiveColumn"
      data-testid="active-empty-multicolumn"
      class="h-[196px] flex-1 border-2 border-dashed border-sky-400 bg-sky-50 p-6 flex flex-col items-center justify-center text-center"
    >
      <p class="font-semibold text-gray-800">Block will be placed here</p>
      <p class="text-sm text-gray-500">Choose one from templates</p>
    </div>
    <div
      v-else
      data-testid="inactive-empty-multicolumn"
      class="h-[196px] flex-1 border-2 border-dashed border-gray-400 bg-gray-50 p-6 flex flex-col items-center justify-center text-center cursor-pointer"
      @click.stop="addBlockToColumn()"
    >
      <span class="text-xl font-bold text-gray-700"><SfIconAdd class="cursor-spointer text-xl" /></span>
      <p class="font-semibold text-gray-800">Add block</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import type { EmptyGridBlockProps } from '~/components/blocks/structure/MultiGrid/types';
const { $isPreview } = useNuxtApp();

type Props = EmptyGridBlockProps & { columnUuid: string };
const props = defineProps<Props>();

const { updateMultigridColumnUuid, setActiveColumnUuid, activeColumnUuid, visiblePlaceholder } = useBlockManager();
const { openDrawerWithView, drawerOpen } = useSiteConfiguration();
const columnUuid = props.meta?.uuid ?? undefined;

const isActiveColumn = computed(() => activeColumnUuid.value === columnUuid);

const addBlockToColumn = () => {
  updateMultigridColumnUuid(props.meta.uuid);
  setActiveColumnUuid(columnUuid);
  openDrawerWithView('blocksList');
  visiblePlaceholder.value = { uuid: '', position: 'top' };
};
</script>
