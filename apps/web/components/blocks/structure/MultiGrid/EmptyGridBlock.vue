<template>
  <div class="flex flex-col items-center justify-start p-10 font-editor">
    <UiButton class="mb-4 mt-20">
      <SfIconAdd class="cursor-pointer text-xl" @click.stop="addBlockToColumn()"/>
    </UiButton>
    <p class="font-bold text-lg">Add block to column</p>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';

const { columnUuid } = defineProps<{columnUuid: string}>();
const { updateMultigridColumnUuid } = useBlockManager();
const { openDrawerWithView } = useSiteConfiguration();

const addBlockToColumn = () => {
  updateMultigridColumnUuid(columnUuid);
  openDrawerWithView('blocksList');
};
</script>