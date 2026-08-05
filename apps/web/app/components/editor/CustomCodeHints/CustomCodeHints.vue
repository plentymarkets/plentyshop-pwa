<template>
  <output
    v-if="hints.length"
    data-testid="custom-code-hints"
    class="my-2 rounded-md border border-blue-300 bg-blue-50 p-3 text-sm text-blue-800 block"
  >
    <div class="font-semibold">{{ getEditorTranslation('custom-code-hint-title') }}</div>
    <ul class="list-disc ml-5 mt-1">
      <li v-for="(hint, idx) in hints" :key="idx">
        {{ getEditorTranslation(hint.message) }}
      </li>
    </ul>
  </output>
</template>

<script setup lang="ts">
import { detectCustomCode } from '~/composables/useHtmlEditorMode/helpers/detectCustomCode';

const props = defineProps<{
  content: string;
}>();

const hints = computed(() => detectCustomCode(props.content));
</script>

<i18n lang="json">
{
  "en": {
    "custom-code-hint-title": "💡 Tip",
    "customCodeHint.cssDetected": "CSS detected. For better maintainability, consider creating a Custom CSS snippet instead.",
    "customCodeHint.jsDetected": "JavaScript detected. For better maintainability, consider creating a Custom JavaScript snippet instead."
  },
  "de": {
    "custom-code-hint-title": "💡 Tip",
    "customCodeHint.cssDetected": "CSS detected. For better maintainability, consider creating a Custom CSS snippet instead.",
    "customCodeHint.jsDetected": "JavaScript detected. For better maintainability, consider creating a Custom JavaScript snippet instead."
  }
}
</i18n>
