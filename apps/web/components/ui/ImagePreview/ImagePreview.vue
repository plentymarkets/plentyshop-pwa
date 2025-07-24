<template>
  <div
    class="relative w-full rounded overflow-hidden min-h-[500px] flex flex-col"
    :class="{ 'bg-[#EFF4F1]': props.image }"
  >    <div class="flex justify-between items-center p-4">
      <div class="text-sm text-gray-700">
        <strong>{{ props.name }}</strong>
        <div v-if="meta.width && meta.height" class="text-xs  mt-1">
          {{ meta.width }} x {{ meta.height }} px
        </div>
      </div>
      <button class="text-gray-500 hover:text-gray-700 text-xl leading-none" @click="close">&times;</button>
    </div>

    <div class="flex-1 flex items-center justify-center p-4">
      <template v-if="!isPlaceholder">
        <img :src="props.image || undefined" alt="Preview" class="max-w-full max-h-[600px] object-contain rounded-md" />
      </template>
      <template v-else>
        <span class="text-gray-400">Select an image from the list to preview it here</span>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
const { placeholderImg } = usePickerHelper();

const props = defineProps<{
  image: string | null;
  name: string;
}>();
const emit = defineEmits(['close']);
const close = () => emit('close');

const isPlaceholder = computed(() => !props.image || props.image === placeholderImg);


const { getMetadata } = useImageMetadata();

const meta = computed(() => getMetadata(props.name));

</script>
