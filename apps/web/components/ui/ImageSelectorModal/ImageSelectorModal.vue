<template>
  <teleport to="body">
    <div v-if="props.open" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white w-[1500px] h-[800px] p-6 rounded-lg overflow-hidden shadow-xl flex flex-col">
        <header class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">Add image {{ imageTypeLabel }}</h2>
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
          <div class="flex-1 overflow-auto pr-4">
            <div v-if="loading" class="flex items-center justify-center h-full w-full min-h-[400px]">
              <SfLoaderCircular size="2xl" class="text-gray-400" />
            </div>
            <UiImageTable
              v-else
              :selected-name="selectedImage?.name || null"
              @select="handleSelect"
              @unselect="selectedImage = null"
            />
          </div>

          <div
            class="w-1/3 flex flex-col justify-center items-center rounded-md p-4"
            :class="selectedImage ? 'bg-[#EFF4F1]' : 'border border-dashed border-gray-300'"
          >
            <UiImagePreview
              :image="selectedImage?.image || null"
              :name="selectedImage?.name || ''"
              @close="selectedImage = null"
            />
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
            @click="addImage"
          >
            Add image
          </button>
        </footer>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { SfIconClose, SfIconInfo, SfTooltip, SfLoaderCircular } from '@storefront-ui/vue';

const { placeholderImg, getImageTypeLabel } = usePickerHelper();
const { loading, getStorageItemsServer } = useItemsTable();

const props = defineProps({
  open: Boolean,
  imageType: {
    type: String,
    default: 'xl',
  },
  customLabel: {
    type: String,
    default: '',
  },
  currentImage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['close', 'add']);

const close = () => emit('close');
const selectedImage = ref<null | {
  image: string;
  name: string;
}>(null);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      getStorageItemsServer();
    }
  },
  { immediate: true },
);

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen && props.currentImage) {
      selectedImage.value = {
        image: props.currentImage,
        name: '',
      };
    } else if (!isOpen) {
      selectedImage.value = null;
    }
  },
);

const canAdd = computed(() => {
  if (!selectedImage.value) return false;
  if (!selectedImage.value.image) return false;
  if (selectedImage.value.image === props.currentImage) return false;
  if (selectedImage.value.image === placeholderImg) return false;
  return true;
});

const imageTypeLabel = computed(() => getImageTypeLabel(props.imageType, props.customLabel));

const handleSelect = (image: { image: string; name: string }) => {
  selectedImage.value = {
    image: image.image,
    name: image.name,
  };
};

const addImage = () => {
  if (selectedImage.value) {
    emit('add', {
      image: selectedImage.value.image,
      name: selectedImage.value.name,
      type: props.imageType,
    });
    close();
  }
};
</script>
