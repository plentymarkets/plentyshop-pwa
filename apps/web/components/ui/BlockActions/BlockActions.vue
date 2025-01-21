<template>
  <div
    class="absolute z-[0] md:z-[1] lg:z-[50] right-0 top-0 flex items-center space-x-4 border border-[#538AEA] bg-white p-2 shadow-md"
    data-testid="edit-block-actions"
  >
    <button class="text-black hover:bg-gray-100 p-1 rounded" data-testid="open-editor-button" @click="triggerEdit">
      <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="editPath" fill="black" />
        </svg>
      </SfIconBase>
    </button>

    <!-- Re add in when we reach the sorting PBI's Re. Add imports as well-->

    <!-- <div class="w-px h-4 bg-gray-300"></div>
    <button class="text-black hover:bg-gray-100 p-1 rounded" data-testid="move-down-button">
      <SfIconArrowUpward />
    </button>

    <button class="text-black hover:bg-gray-100 p-1 rounded" data-testid="move-up-button">
      <SfIconArrowDownward />
    </button> -->

    <div class="w-px h-4 bg-gray-300" />

    <button class="text-black hover:bg-gray-100 p-1 rounded" data-testid="delete-block-button" @click="triggerDelete">
      <SfIconDelete />
    </button>
  </div>
</template>

<script lang="ts" setup>
import { SfIconDelete } from '@storefront-ui/vue';
import { editPath } from 'assets/icons/paths/edit';

const props = defineProps<{ index: number }>();

const emit = defineEmits(['edit', 'delete']);

const triggerEdit = () => {
  emit('edit', props.index);
};
const triggerDelete = () => {
  emit('delete', props.index);
};
</script>
