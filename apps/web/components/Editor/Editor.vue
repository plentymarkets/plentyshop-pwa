<template>
  <div class="mx-auto p-5">
    <div
      ref="container"
      class="flex items-start border rounded-md overflow-hidden shadow-lg"
      style="max-height: 500px; overflow: auto"
    >
      <div class="bg-primary-500 text-white text-right pr-4 pt-2 font-mono text-sm w-10">
        <div v-for="line in lineCount" :key="line">{{ line }}</div>
      </div>
      <textarea
        v-model="jsonText"
        @input="handleInput"
        @paste="handlePaste"
        @keydown.tab.prevent="insertTab"
        ref="textarea"
        class="w-full h-full p-2 font-mono text-sm border-none resize-none outline-none"
        placeholder="Edit JSON here..."
      ></textarea>
    </div>
    <UiButton @click="formatJson" class="mt-4 px-4 py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600">
      Format JSON
    </UiButton>
    <UiButton @click="clearText" class="mt-4 ml-2 px-4 py-2 text-white rounded-md bg-red-500 hover:bg-red-600">
      Clear Text
    </UiButton>
    <div v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { heroData } from './heroData';
import { mediaData } from './mediaData';
const jsonText = ref(
  JSON.stringify(
    {
      id: 22,
      hero: heroData,
      valueProposition: mediaData,
      featured: [
        {
          headline: '',
          categoryId: 1,
        },
        {
          headline: '',
          categoryId: 2,
        },
      ],
    },
    null,
    2,
  ),
);
const errorMessage = ref('');
const textarea = ref(null);
const container = ref<HTMLElement | null>(null);

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
    validateJson();
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

const clearText = () => {
  jsonText.value = '';
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

onMounted(() => {
  resizeTextarea();
  if (container.value) {
    container.value.style.overflow = 'auto';
  }
});
</script>
