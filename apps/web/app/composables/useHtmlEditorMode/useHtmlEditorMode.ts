import type { EditorMode, UseHtmlEditorModeOptions } from './types';
import { validateHtmlSyntax } from './helpers/validations';

export function useHtmlEditorMode(contentModel: Ref<string>, options: UseHtmlEditorModeOptions = {}) {
  const { defaultMode = 'wysiwyg', commitOnValid = true, maxErrors = 5 } = options;

  const editorMode = ref<EditorMode>(defaultMode);
  const htmlDraft = ref(contentModel.value ?? '');
  const htmlErrors = ref<string[]>([]);

  const ariaDescribedBy = computed(() => (htmlErrors.value.length ? 'html-editor-errors' : undefined));

  const validateAndCommitIfAllowed = (nextDraft: string) => {
    const nextErrors = validateHtmlSyntax(nextDraft, maxErrors);
    htmlErrors.value = nextErrors;

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
    ariaDescribedBy,
    validateHtmlSyntax: (html: string) => validateHtmlSyntax(html, maxErrors),
    switchToHtmlMode,
    switchToWysiwygMode,
  };
}
