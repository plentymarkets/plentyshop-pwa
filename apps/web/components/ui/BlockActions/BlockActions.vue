<template>
  <div
    class="absolute right-0 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2 mt-2 border border-[#538AEA] rounded-[6px]"
    data-testid="edit-block-actions"
  >
    <UiButton
      @click="onEditClick"
      class="text-white rounded hover:bg-transparent active:bg-transparent !px-1"
      variant="tertiary"
      size="sm"
      data-testid="open-editor-button"
    >
      <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="editPath" fill="black" />
        </svg>
      </SfIconBase>
    </UiButton>
    <hr class="w-[15px] mx-auto bg-black border-0 h-[1px]" />
    <UiButton
      @click="onDeleteClick"
      class="text-[#000] rounded hover:bg-transparent active:bg-transparent !px-1"
      variant="tertiary"
      size="sm"
    >
      <SfIconBase size="xs" viewBox="0 0 18 18" class="fill-primary-900 cursor-pointer">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path :d="deletePath" fill="black" />
        </svg>
      </SfIconBase>
    </UiButton>
  </div>
</template>

<script lang="ts" setup>
import { SfIconBase } from '@storefront-ui/vue';
import { editPath } from 'assets/icons/paths/edit';
import { deletePath } from 'assets/icons/paths/delete';

const props = defineProps<{ index: number }>();

const emit = defineEmits(['edit', 'delete']);

const onEditClick = () => {
  emit('edit', props.index);
};
const onDeleteClick = () => {
  emit('delete', props.index);
};
</script>
