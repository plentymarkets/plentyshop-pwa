<template>
  <teleport to="body">
    <div v-if="props.open" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white w-[1500px] h-[800px] p-6 rounded-lg overflow-hidden shadow-xl flex flex-col">
        <header class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">Add image (XL, Desktop)</h2>
          <div class="flex items-center gap-2">
            <SfTooltip label="This is a placeholder label" placement="top" :show-arrow="true" class="z-10">
              <SfIconInfo size="sm" />
            </SfTooltip>

            <button class="!p-0" data-testid="image-uploader-close" @click="close">
              <SfIconClose />
            </button>
          </div>
        </header>

        <main class="flex flex-1 overflow-hidden">
          <div class="flex-1 overflow-auto " />
          <!-- <UiProductTable /> -->
          <UiProductTableImage />
          <div
            class="w-1/3 flex flex-col justify-center items-center border border-dashed border-gray-300 rounded-md p-4"
          >
            Select an image from the list to preview it here
          </div>
        </main>

        <footer class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            data-testid="image-uploader-close-button"
            class="border border-editor-button py-1 px-4 rounded-md flex items-center justify-center text-editor-button"
            @click="close"
          >
            Cancel
          </button>

          <button
            :disabled="!canAdd"
            data-testid="image-uploader-add-button"
            class="bg-editor-button text-white py-1 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add image
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { SfIconClose, SfIconInfo, SfTooltip } from '@storefront-ui/vue';

const props = defineProps({
  open: Boolean,
});

const emit = defineEmits(['close']);

const close = () => emit('close');

const canAdd = ref(false);
</script>
