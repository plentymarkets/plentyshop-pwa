<template>
  <div
    class="relative w-full rounded overflow-hidden min-h-[500px] flex flex-col"
    :class="{ 'bg-[#EFF4F1]': props.image }"
  >
    <div class="flex justify-between items-center p-4">
      <div class="text-sm text-gray-700">
        <strong>{{ props.name }}</strong>
        <div v-if="meta.width && meta.height" class="text-xs mt-1">{{ meta.width }} x {{ meta.height }} px</div>
      </div>
      <SfTooltip label="Click here to upload" placement="top" :show-arrow="true" class="z-10">
      <button
        type="button"
        aria-label="Close preview"
        class="h-8 w-8 flex items-center justify-center rounded text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300"
        @click="close"
      >
        <SfIconUpload size="sm" />
      </button>
      </SfTooltip>
    </div>

    <div class="flex-1 flex items-center justify-center p-4">
        <img :src="props.image || undefined" alt="Preview" class="max-w-full max-h-[600px] object-contain rounded-md" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SfIconUpload, SfTooltip } from '@storefront-ui/vue'

const props = defineProps<{
  image: string | null;
  name: string;
}>();
const emit = defineEmits(['close']);
const close = () => emit('close');
const { getMetadata } = useImageMetadata();
const meta = computed(() => {
  return props.name ? getMetadata(props.name) : { width: '', height: '' };
});
</script>
