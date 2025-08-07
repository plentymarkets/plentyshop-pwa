<template>
  <div>
    <form @submit="handleFileUpload">
      <h1 class="text-2xl font-bold mb-4">Upload File</h1>
      <p class="mb-2">Select a file to upload:</p>
      <input ref="fileInput" type="file" />
      <p class="mb-2">Specify path (e.g. dir/subdir):</p>
      <input v-model="filePath" type="text" placeholder="dir/subdir" />
      <button class="mr-5 text-red-500" type="submit">Submit</button>
    </form>
    <label for="folder-select" class="block text-sm font-medium text-gray-700 mb-1">Select folder</label>
    <select id="folder-select" v-model="filePath" class="border border-gray-300 rounded px-2 py-1 w-full">
      <option value="">All folders</option>
      <option v-for="folder in folders" :key="folder" :value="folder">
        {{ folder }}
      </option>
    </select>
    <EditablePage :identifier="'index'" :type="'immutable'" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const { uploadStorageItem, folders } = useItemsTable();
const filePath = ref('');

const handleFileUpload = async (event: Event) => {
  event.preventDefault();
  const target = event.target as HTMLFormElement;
  const input = target.querySelector('input[type=file]') as HTMLInputElement;
  if (input && input.files && input.files.length > 0) {
    await uploadStorageItem(input.files[0], filePath.value);
  }
};
</script>
