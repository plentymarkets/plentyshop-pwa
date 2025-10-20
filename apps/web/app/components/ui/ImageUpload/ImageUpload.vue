<template>
  <div
    class="w-full h-full min-h-[500px] flex flex-col items-center justify-center text-center text-gray-500 p-6 cursor-pointer hover:border-gray-400"
    @click="triggerFileInput"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <SfIconUpload size="2xl" class="mb-2" />
    <p>
      {{ getEditorTranslation('imageUpload.dragFile') }}
      <span class="text-green-600 underline"> {{ getEditorTranslation('imageUpload.selectFile') }}</span>
    </p>
    <p class="text-sm text-gray-400 mt-1">{{ getEditorTranslation('imageUpload.maxFileSize') }}</p>
    <input ref="fileInput" type="file" class="hidden" :accept="accept" @change="handleFileChange" />
  </div>
</template>

<script lang="ts" setup>
import { SfIconUpload } from '@storefront-ui/vue';
const { send } = useNotification();
const emit = defineEmits(['file-selected']);

const fileInput = ref<HTMLInputElement | null>(null);
const accept = ALLOWED_ACCEPT;

const triggerFileInput = () => {
  fileInput.value?.click();
};
const notifyInvalid = (msg: string) => {
  send({
    type: 'negative',
    message: msg,
  });
};
const handleFileChange = makeHandleFileChange((file) => emit('file-selected', file), notifyInvalid);

const handleDrop = makeHandleDrop((file) => emit('file-selected', file), notifyInvalid);
</script>

<i18n lang="json">
{
  "en": {
    "imageUpload": {
      "dragFile": "Drag file here or",
      "selectFile": "click to select file",
      "maxFileSize": "Maximum upload file size is 100 MB"
    }
  },
  "de": {
    "imageUpload": {
      "invalidFileType": "Drag file here or",
      "selectFile": "click to select file",
      "maxFileSize": "Maximum upload file size is 100 MB"
    }
  }
}
</i18n>
