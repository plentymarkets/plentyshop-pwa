<template>
  <div class="full-width border p-2">
    <div v-for="(value, key) in attributes" :key="key">
      <label class="capitalize" :for="key">{{ key }}:</label>
      <SfInput v-if="key !== 'content'" :id="key" v-model="attributes[key]" type="text" :placeholder="`Enter ${key}`" />
    </div>
    <SfTextarea
      :id="'content'"
      v-model="attributes['content']"
      class="w-full"
      label="content"
      placeholder="Enter content"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, onMounted, defineEmits } from 'vue';
import { SfInput, SfTextarea } from '@storefront-ui/vue';
import type { MarkupBuilderProps } from './types';

const props = defineProps<MarkupBuilderProps>();

const emit = defineEmits(['update:generatedHtml']);

const tag = ref<string>('');
const attributes = ref<Record<string, string>>({});
const generatedHtml = ref<string>('');

const parseInputHtml = (inputHtml: string) => {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = inputHtml.trim();
  const element = tempDiv.firstElementChild;

  if (element) {
    tag.value = element.tagName.toLowerCase();
    const attrs: Record<string, string> = {};

    Array.from(element.attributes).forEach((attr) => {
      attrs[attr.name] = attr.value;
    });

    attributes.value = attrs;
    attributes.value.content = element.innerHTML.trim();
  }
};

const generateHtml = () => {
  const tagAttributes = Object.entries(attributes.value)
    .filter(([key, value]) => value !== '' && key !== 'content')
    .map(([key, value]) => `${key}='${value}'`)
    .join(' ');

  generatedHtml.value = `<${tag.value} ${tagAttributes}>${attributes.value.content}</${tag.value}>`;
  emit('update:generatedHtml', generatedHtml.value);
};

watch(
  () => props.inputHtml,
  (newHtml) => {
    parseInputHtml(newHtml);
  },
  { immediate: true },
);

watch([tag, () => attributes.value], generateHtml, { deep: true });

onMounted(() => {
  parseInputHtml(props.inputHtml);
});
</script>
