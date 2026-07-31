<template>
  <div class="flex flex-col items-center justify-start min-h-screen p-10 font-editor">
    <UiButton class="mb-4 mt-20" @click.stop="addNewBlock($event, 'bottom')">
      <SfIconAdd class="cursor-pointer text-xl" />
    </UiButton>
    <p class="font-bold text-lg">{{ t('homepage.emptyBlock.headline') }}</p>
  </div>
</template>

<script setup lang="ts">
import { SfIconAdd } from '@storefront-ui/vue';
import type { BlockPosition } from '~/composables/useBlockManager/types';

const { openAddBlockPopover } = useAddBlockPopover();
const { logContentCreateBlock } = useLogEvent();

const addNewBlock = (event: MouseEvent, position: BlockPosition) => {
  openAddBlockPopover({ anchorEl: event.currentTarget as HTMLElement, targetUuid: '0', position });
  logContentCreateBlock();
};
</script>
