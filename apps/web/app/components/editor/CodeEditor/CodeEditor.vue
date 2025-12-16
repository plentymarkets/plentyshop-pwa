<template>
  <div class="code-editor">
    <div class="editor-header">
      <button class="format-button" :disabled="formatting" @click="formatCode">
        {{ formatting ? 'Formatting...' : 'Format Code' }}
      </button>
    </div>
    <div ref="editorElement" class="editor-container" />
  </div>
</template>

<script setup lang="ts">
import { EditorView, basicSetup } from 'codemirror';
import { StateEffect, EditorState } from '@codemirror/state';
import { css } from '@codemirror/lang-css';
import { javascript } from '@codemirror/lang-javascript';
import jsBeautify from 'js-beautify';

type Language = 'css' | 'javascript';

const props = defineProps<{
  modelValue: string;
  language?: Language;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const editorElement = ref<HTMLElement>();
let editorView: EditorView | null = null;
const currentLanguage = ref<Language>(props.language || 'css');
const formatting = ref(false);

const getLanguageExtension = (lang: Language) => {
  return lang === 'css' ? css() : javascript();
};

const formatCode = async () => {
  if (!editorView || formatting.value) return;

  formatting.value = true;

  try {
    const currentContent = editorView.state.doc.toString();
    let formattedContent = '';

    if (currentLanguage.value === 'css') {
      formattedContent = jsBeautify.css(currentContent, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        space_around_selector_separator: true,
      });
    } else {
      formattedContent = jsBeautify.js(currentContent, {
        indent_size: 2,
        indent_char: ' ',
        max_preserve_newlines: 2,
        preserve_newlines: true,
        space_in_empty_paren: true,
        jslint_happy: false,
        keep_array_indentation: false,
        brace_style: 'collapse',
      });
    }

    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: formattedContent,
      },
    });

    emit('update:modelValue', formattedContent);
  } catch (error) {
    console.error('Error formatting code:', error);
  } finally {
    formatting.value = false;
  }
};

const editorTheme = EditorView.theme({
  '&': {
    fontSize: '14px',
    backgroundColor: '#ffffff',
  },
  '.cm-content': {
    color: '#333333',
  },
  '.cm-gutters': {
    backgroundColor: '#f8f9fa',
    color: '#6c757d',
    borderRight: '1px solid #dee2e6',
  },
  '.cm-activeLine': {
    backgroundColor: '#e9ecef',
  },
  '.cm-activeLineGutter': {
    backgroundColor: '#dee2e6',
  },
  '.cm-selectionBackground, .cm-content ::selection': {
    backgroundColor: '#cce5ff',
  },
  '.cm-selectionMatch': {
    backgroundColor: '#e3f2fd',
  },
  '.cm-cursor': {
    borderLeft: '2px solid #1976d2',
  },
  '.cm-tooltip': {
    backgroundColor: '#ffffff',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
  },
});

const initializeEditor = () => {
  if (!editorElement.value) return;

  const startState = EditorState.create({
    doc: props.modelValue,
    extensions: [
      basicSetup,
      getLanguageExtension(currentLanguage.value),
      editorTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const content = update.state.doc.toString();
          emit('update:modelValue', content);
        }
      }),
    ],
  });

  editorView = new EditorView({
    state: startState,
    parent: editorElement.value,
  });
};

watch(
  () => props.modelValue,
  (newValue) => {
    if (editorView && newValue !== editorView.state.doc.toString()) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: newValue,
        },
      });
    }
  },
);

watch(currentLanguage, (newLanguage) => {
  if (!editorView) return;

  editorView.dispatch({
    effects: StateEffect.reconfigure.of([
      basicSetup,
      getLanguageExtension(newLanguage),
      editorTheme,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const content = update.state.doc.toString();
          emit('update:modelValue', content);
        }
      }),
    ]),
  });
});

onMounted(initializeEditor);
onUnmounted(() => {
  editorView?.destroy();
});
</script>

<style scoped>
.code-editor {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
}

.language-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #495057;
}

.language-selector select {
  padding: 6px 12px;
  border: 1px solid #ced4da;
  border-radius: 4px;
  background: white;
  color: #495057;
  font-size: 14px;
}

.format-button {
  padding: 8px 16px;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.format-button:hover:not(:disabled) {
  background: #1565c0;
}

.format-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.7;
}

.editor-container {
  height: 400px;
}

:deep(.cm-editor) {
  height: 100%;
}

:deep(.cm-scroller) {
  line-height: 1.5;
}

:deep(.cm-line) {
  padding: 0 8px;
}

:deep(.cm-gutter) {
  min-width: 20px;
  text-align: center;
}

:deep(.cm-selectionLayer) {
  z-index: 1 !important;
  opacity: 0.2;
}

:deep(.cm-selectionBackground),
:deep(.ͼ2.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground),
:deep(.cm-content ::selection) {
  background-color: #399aff;
}
</style>
