<template>
  <div v-if="$isPreview" class="flex flex-col items-center justify-start p-10 font-editor">
    <UiButton class="mb-4 mt-20" @click.stop="addBlockToColumn()">
      <SfIconAdd class="cursor-pointer text-xl" />
    </UiButton>
    <p class="font-bold text-lg">Add block to column</p>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import type { EmptyGridBlockProps } from '~/components/blocks/structure/MultiGrid/types';

const { $isPreview } = useNuxtApp();
const props = defineProps<EmptyGridBlockProps>();
const { updateMultigridColumnUuid, visiblePlaceholder } = useBlockManager();
const { openDrawerWithView } = useSiteConfiguration();

const addBlockToColumn = () => {
  updateMultigridColumnUuid(props.meta.uuid);
  openDrawerWithView('blocksList');
  visiblePlaceholder.value = { uuid: '', position: 'top' };
};
</script>
