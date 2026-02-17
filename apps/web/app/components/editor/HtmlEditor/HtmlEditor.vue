<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]"
      @click.self="emit('close')"
    >
      <div class="bg-white w-[90%] m-20 h-[90%] p-6 rounded-lg shadow-xl flex flex-col overflow-hidden">
        <header class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold">{{ getEditorTranslation('heading') }}</h2>
          <UiButton variant="tertiary" class="!p-2" @click="emit('close')">
            <SfIconClose />
          </UiButton>
        </header>

        <div
          v-if="htmlErrors && htmlErrors.length"
          id="expert-html-editor-errors"
          class="mt-2 mb-2 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-800"
          role="alert"
        >
          <div class="font-semibold">{{ getEditorTranslation('html-invalid-label') }}</div>
          <ul class="list-disc ml-5 mt-1">
            <li v-for="(error, index) in htmlErrors.slice(0, 3)" :key="index">{{ error }}</li>
          </ul>
        </div>

        <main class="flex-1 overflow-hidden flex flex-col">
          <div class="flex-1 overflow-y-auto">
            <SfTextarea
              id="expert-html-editor"
              v-model="localValue"
              rows="20"
              class="w-full h-full font-mono text-sm border rounded-md shadow-sm"
              :class="htmlErrors && htmlErrors.length ? 'border-red-400' : 'border-gray-300'"
              :aria-invalid="htmlErrors && htmlErrors.length ? 'true' : 'false'"
              :aria-describedby="ariaDescribedBy"
            />
          </div>
        </main>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { SfIconClose, SfTextarea } from '@storefront-ui/vue';

const props = defineProps<{
  modelValue: string;
  ariaDescribedBy?: string;
  htmlErrors?: string[];
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
  (event: 'close'): void;
}>();

const localValue = computed({
  get: () => props.modelValue ?? '',
  set: (value: string) => emit('update:modelValue', value ?? ''),
});

const ariaDescribedBy = computed(() => props.ariaDescribedBy ?? undefined);
const htmlErrors = computed(() => props.htmlErrors ?? []);
</script>

<i18n lang="json">
{
  "en": {
    "heading": "HTML editor"
  },
  "de": {
    "heading": "HTML editor"
  }
}
</i18n>
