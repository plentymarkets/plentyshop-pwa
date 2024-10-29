<template>
  <div class="max-w-xl mx-auto p-4">
    <div class="flex items-start border rounded-md overflow-hidden">
      <div class="bg-gray-100 text-gray-500 text-right pr-4 pt-2 font-mono text-sm w-10 select-none">
        <div v-for="line in lineCount" :key="line">{{ line }}</div>
      </div>
      <textarea
        v-model="jsonText"
        @input="handleInput"
        @paste="handlePaste"
        @keydown.tab.prevent="insertTab"
        ref="textarea"
        class="w-full p-2 font-mono text-sm border-none resize-none outline-none"
        placeholder="Edit JSON here..."
      ></textarea>
    </div>
    <button
      @click="formatJson"
      class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      Format JSON
    </button>
    <div v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
const jsonText = ref('');
const errorMessage = ref('');
const textarea = ref(null);

const lineCount = computed(() => {
  return jsonText.value ? jsonText.value.split('\n').length : 1;
});

const resizeTextarea = () => {
  if (textarea.value) {
    const textareaElement = textarea.value as HTMLElement;
    textareaElement.style.height = 'auto';
    textareaElement.style.height = `${textareaElement.scrollHeight}px`;
  }
};

const validateJson = () => {
  try {
    JSON.parse(jsonText.value);
    errorMessage.value = '';
  } catch (error: any) {
    errorMessage.value = 'Invalid JSON: ' + error.message;
  }
};

const handleInput = () => {
  validateJson();
  resizeTextarea();
};

const handlePaste = () => {
  nextTick(() => {
    resizeTextarea();
  });
};

const formatJson = () => {
  try {
    const json = JSON.parse(jsonText.value);
    jsonText.value = JSON.stringify(json, null, 2);
    errorMessage.value = '';
    nextTick(resizeTextarea);
  } catch (error: any) {
    errorMessage.value = 'Invalid JSON: ' + error.message;
  }
};

const insertTab = (event: KeyboardEvent) => {
  const target = event.target as HTMLTextAreaElement;
  const start = target.selectionStart;
  const end = target.selectionEnd;
  jsonText.value = jsonText.value.slice(0, Math.max(0, start)) + '  ' + jsonText.value.slice(Math.max(0, end));
  nextTick(() => {
    target.selectionStart = target.selectionEnd = start + 2;
  });
};
onMounted(resizeTextarea);
</script>
