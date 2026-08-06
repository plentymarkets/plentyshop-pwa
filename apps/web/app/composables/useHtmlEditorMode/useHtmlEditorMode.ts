import type { EditorMode, UseHtmlEditorModeOptions, CustomCodeHint } from './types';
import { validateHtmlSyntax } from './helpers/validations';
import { detectCustomCode } from './helpers/detectCustomCode';

export function useHtmlEditorMode(contentModel: Ref<string>, options: UseHtmlEditorModeOptions = {}) {
  const { defaultMode = 'wysiwyg', commitOnValid = true, maxErrors = 5 } = options;

  const editorMode = ref<EditorMode>(defaultMode);
  const htmlDraft = ref(contentModel.value ?? '');
  const htmlErrors = ref<string[]>([]);
  const customCodeHints = ref<CustomCodeHint[]>([]);

  const ariaDescribedBy = computed(() => {
    const parts: string[] = [];
    if (htmlErrors.value.length) {
      parts.push('html-editor-errors');
    }
    if (customCodeHints.value.length) {
      parts.push('html-editor-hints');
    }
    return parts.length ? parts.join(' ') : undefined;
  });

  const validateAndCommitIfAllowed = (nextDraft: string) => {
    const nextErrors = validateHtmlSyntax(nextDraft, maxErrors);
    htmlErrors.value = nextErrors;

    const hints = detectCustomCode(nextDraft);
    customCodeHints.value = hints;

    if (!commitOnValid) return;
    if (nextErrors.length) return;

    contentModel.value = nextDraft;
  };

  const switchToHtmlMode = () => {
    editorMode.value = 'html';
    htmlDraft.value = contentModel.value ?? '';
    validateAndCommitIfAllowed(htmlDraft.value);
  };

  const switchToWysiwygMode = () => {
    editorMode.value = 'wysiwyg';

    if (!commitOnValid) {
      htmlErrors.value = validateHtmlSyntax(htmlDraft.value, maxErrors);
      customCodeHints.value = detectCustomCode(htmlDraft.value);
      if (!htmlErrors.value.length) {
        contentModel.value = htmlDraft.value;
      }
    }
  };

  watch(
    () => editorMode.value,
    (mode) => {
      if (mode === 'html') {
        htmlDraft.value = contentModel.value ?? '';
        validateAndCommitIfAllowed(htmlDraft.value);
      } else {
        switchToWysiwygMode();
      }
    },
    { immediate: true },
  );

  watch(
    () => htmlDraft.value,
    (nextDraft) => {
      if (editorMode.value !== 'html') return;
      validateAndCommitIfAllowed(nextDraft);
    },
  );

  watch(
    () => contentModel.value,
    (nextValue) => {
      if (editorMode.value !== 'wysiwyg') return;
      htmlDraft.value = nextValue ?? '';
    },
  );

  return {
    editorMode,
    htmlDraft,
    htmlErrors,
    customCodeHints,
    ariaDescribedBy,
    validateHtmlSyntax: (html: string) => validateHtmlSyntax(html, maxErrors),
    switchToHtmlMode,
    switchToWysiwygMode,
  };
}
