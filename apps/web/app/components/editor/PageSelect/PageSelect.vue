<template>
  <Multiselect
    :model-value="selectedOption"
    :options="options"
    :placeholder="'Search pages...'"
    :deselect-label="'Selected'"
    :searchable="true"
    :custom-label="(option: PathOption) => `${option.label} — ${option.value}`"
    label="label"
    track-by="value"
    select-label=""
    class="w-full cursor-pointer [&_.multiselect__content-wrapper]:!z-popover"
    @update:model-value="onSelected"
  />
</template>

<script setup lang="ts">
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';
import type { PathOption } from '~/components/editor/PageSelect/types';

const props = defineProps<{
  modelValue: string | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();

const options: PathOption[] = Object.entries(paths).map(([name, path]) => ({
  value: path,
  label: name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim(),
}));

const selectedOption = computed(() => {
  if (!props.modelValue) return null;
  return options.find((option) => option.value === props.modelValue) ?? null;
});

const onSelected = (option: PathOption | null) => {
  emit('update:modelValue', option?.value ?? null);
};
</script>
