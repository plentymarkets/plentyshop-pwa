<template>
  <div class="mx-auto p-5">
    <div class="flex items-start border rounded-md shadow-lg max-h-[500px] overflow-hidden">
      <div
        class="bg-primary-500 text-white text-right pr-4 pt-2 font-mono text-sm w-10 h-[500px] overflow-y-auto"
        ref="lineNumberContainer"
      >
        <div v-for="line in lineCount" :key="line">{{ line }}</div>
      </div>
      <textarea
        v-model="jsonText"
        @input="handleInput"
        @scroll="syncScroll"
        ref="textarea"
        class="w-full p-2 font-mono text-sm border-none resize-none outline-none h-[500px]"
        :placeholder="$t('editMode.editJsonPlaceholder')"
      ></textarea>
    </div>
    <UiButton @click="formatJson" class="mt-4 px-4 py-2 text-white rounded-md bg-blue-500 hover:bg-blue-600">
      {{ $t('editMode.formatJson') }}
    </UiButton>
    <UiButton @click="purgeJson" class="mt-4 ml-2 px-4 py-2 text-white rounded-md bg-green-500 hover:bg-green-600">
      {{ $t('editMode.minifyJson') }}
    </UiButton>
    <UiButton @click="clearText" class="mt-4 ml-2 px-4 py-2 text-white rounded-md bg-red-500 hover:bg-red-600">
      {{ $t('editMode.clearJson') }}
    </UiButton>
    <div v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { heroData } from './heroData';
import { mediaData } from './mediaData';

const initialJson = JSON.stringify(
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
);

const {
  jsonText,
  errorMessage,
  lineCount,
  textarea,
  lineNumberContainer,
  syncScroll,
  handleInput,
  formatJson,
  purgeJson,
  clearText,
} = useJsonEditor(initialJson);
</script>
