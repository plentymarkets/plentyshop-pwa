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
            @click.prevent="openModal"
          >
            Select
          </button>
          <button
            v-if="!isPlaceholder"
            type="button"
            class="border border-slate-900 text-slate-900 h-[40px] px-3 py-1.5 rounded-md hover:bg-gray-100 flex items-center justify-center"
            @click.prevent="deleteImage"
          >
            <SfIconDelete />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal is now internal to the picker -->
    <UiImageSelectorModal
      :open="isModalOpen"
      :image-type="type ?? ''"
      :current-image="internalImage"
      :custom-label="label"
      @close="closeModal"
      @add="handleAdd"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { SfTooltip, SfIconInfo, SfIconDelete } from '@storefront-ui/vue';
import UiImageSelectorModal from '~/components/ui/ImageSelectorModal/ImageSelectorModal.vue';

interface Props {
  label: string;
  image: string | undefined;
  placeholder: string;
  dimensions: string;
  showTooltip?: boolean;
  type?: string;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:image', payload: { image: string; type?: string }): void;
}>();

const isPlaceholder = computed(() => props.image === props.placeholder);

const isModalOpen = ref(false);
const internalImage = ref(props.image);

watch(
  () => props.image,
  (val) => {
    internalImage.value = val;
  },
);

function openModal() {
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function handleAdd({ image }: { image: string; name: string }) {
  internalImage.value = image;
  emit('update:image', { image, type: props.type });
  closeModal();
}

function deleteImage() {
  internalImage.value = props.placeholder;
  emit('update:image', { image: props.placeholder, type: props.type });
}
</script>
