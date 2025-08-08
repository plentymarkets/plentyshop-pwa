<template>
  <div
    class="w-full h-full min-h-[500px] flex flex-col items-center justify-center text-center text-gray-500 p-6 cursor-pointer hover:border-gray-400"
    @click="triggerFileInput"
    @dragover.prevent
    @drop.prevent="handleDrop"
  >
    <SfIconDownload size="2xl" class="mb-2" />
    <p>
      Drag file here or
      <span class="text-green-600 underline"> click to select file</span>
    </p>
    <p class="text-sm text-gray-400 mt-1">Maximum upload file size 512MB</p>
    <input
      ref="fileInput"
      type="file"
      class="hidden"
      :accept="accept"
      @change="handleFileChange"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SfIconDownload } from '@storefront-ui/vue'

const emit = defineEmits(['file-selected'])

const fileInput = ref(null)
const accept = 'image/*'

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileChange = (event) => {
  const file = event.target.files[0]
  console.log('Selected file:', file)
  if (file) {
    emit('file-selected', file)
    event.target.value = ''
  }
}

const handleDrop = (event) => {
  const file = event.dataTransfer.files[0]
  if (file) emit('file-selected', file)
}


</script>
