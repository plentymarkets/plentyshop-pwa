<template>
  <div class="mx-auto p-5">
    <div class="flex items-start border rounded-md shadow-lg max-h-[500px] overflow-hidden relative">
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
        data-testid="editor-textarea"
      ></textarea>
      <SfButton id="close" size="sm" class="absolute top-2 right-2" @click="closeEditor"
        ><SfIconCancel class="cursor-pointer"></SfIconCancel
      ></SfButton>
    </div>
    <div v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { SfIconCancel } from '@storefront-ui/vue';

const props = defineProps<{
  block: Block | null;
  index: number;
}>();

const emit = defineEmits(['update']);
const { jsonText, errorMessage, lineCount, textarea, lineNumberContainer, syncScroll, handleInput } = useJsonEditor(
  JSON.stringify(props.block, null, 2),
);

const closeEditor = () => {
  const { isEditing } = useEditor();
  isEditing.value = false;
};

watch(
  () => jsonText.value,
  () => {
    emit('update', props.index, JSON.parse(jsonText.value));
  },
);
</script>
