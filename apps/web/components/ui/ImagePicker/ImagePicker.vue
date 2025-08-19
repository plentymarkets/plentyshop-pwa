<template>
  <div class="mb-6">
    <div class="flex items-center justify-between mb-1">
      <UiFormLabel>{{ label }}</UiFormLabel>
      <SfTooltip v-if="showTooltip && !isPlaceholder" :label="dimensions">
        <SfIconInfo class="text-gray-500 hover:text-gray-700 cursor-pointer w-4 h-4" />
      </SfTooltip>
    </div>

    <div class="flex items-start gap-4">
      <div class="w-[120px] h-[90px] flex-shrink-0 rounded overflow-hidden border">
        <NuxtImg :src="image || placeholder" :alt="label" class="w-full h-full object-cover" />
      </div>

      <div class="flex-1">
        <template v-if="!isPlaceholder">
          <p class="text-sm text-gray-800 truncate">image_name_111.png</p>
          <p class="text-sm text-gray-500">{{ dimensions }}</p>
        </template>
        <template v-else>
          <p class="typography-text-xs text-gray-500 flex gap-1 mt-2 sm:mb-0">
            Recommended dimensions: {{ dimensions }}
          </p>
        </template>

        <div class="mt-3 flex items-center gap-2">
          <button
            type="button"
            class="bg-slate-900 text-white text-sm px-4 py-1.5 h-[40px] rounded-md hover:bg-slate-800"
            @click.prevent="isUploaderOpen = true"
          >
            Select
          </button>
          <button
            v-if="!isPlaceholder"
            type="button"
            class="border border-slate-900 text-slate-900 h-[40px] px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center justify-center"
            @click.prevent="emit('delete')"
          >
            <SfIconDelete />
          </button>
        </div>
        <UiImageSelectorModal
          :open="isUploaderOpen"
          :image-type="selectedImageType"
          :current-image="props.image"
          @close="isUploaderOpen = false"
          @add="handleImageAdd"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { SfTooltip, SfIconInfo, SfIconDelete } from '@storefront-ui/vue';

interface Props {
  label: string;
  image: string | undefined;
  placeholder: string;
  dimensions: string;
  showTooltip?: boolean;
  selectedImageType?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'delete'): void;
  (e: 'add', payload: { image: string; type: string }): void;
}>();

const isPlaceholder = computed(() => props.image === props.placeholder);
const isUploaderOpen = ref(false);
const selectedImageType = ref(props.selectedImageType || 'wideScreen');

function handleImageAdd({ image, type }: { image: string; type: string }) {
  emit('add', { image, type });
  isUploaderOpen.value = false;
}
</script>
