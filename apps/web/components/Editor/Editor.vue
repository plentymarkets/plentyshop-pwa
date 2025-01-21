<template>
  <div class="mx-auto p-5">
    <div class="flex items-start border rounded-md shadow-lg max-h-[500px] overflow-hidden relative">
      <div
        ref="lineNumberContainer"
        class="bg-primary-500 text-white text-right pr-4 pt-2 font-mono text-sm w-10 h-[500px] overflow-y-auto"
      >
        <div v-for="line in lineCount" :key="line">{{ line }}</div>
      </div>
      <textarea
        ref="textarea"
        v-model="jsonText"
        class="w-full p-2 font-mono text-sm border-none resize-none outline-none h-[500px]"
        :placeholder="$t('editMode.editJsonPlaceholder')"
        data-testid="editor-textarea"
        @input="handleInput"
        @scroll="syncScroll"
      />
      <SfButton id="close" size="sm" class="absolute top-2 right-2" @click="closeEditor"
        ><SfIconCancel class="cursor-pointer"
      /></SfButton>
    </div>
    <div v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { SfIconCancel } from '@storefront-ui/vue';
import { watchDebounced } from '@vueuse/core';

const props = defineProps<{
  block: Block | null;
  index: number;
}>();

const emit = defineEmits(['update']);
const { jsonText, errorMessage, lineCount, textarea, lineNumberContainer, syncScroll, handleInput } = useJsonEditor(
  JSON.stringify(props.block, null, 2),
);

const closeEditor = () => {
  emit('update', props.index, JSON.parse(jsonText.value));
  const { isEditing } = useEditor();
  isEditing.value = false;
};

watch(
  () => props.block,
  (updatedData) => {
    jsonText.value = JSON.stringify(updatedData, null, 2);
  },
  { immediate: true, deep: true },
);

watchDebounced(
  () => jsonText.value,
  () => {
    if (jsonText.value !== '') {
      emit('update', props.index, JSON.parse(jsonText.value));
    }
  },
  { debounce: 100 },
);
</script>
