import type { Editor } from '@tiptap/core';
import { validateUrl } from '~/components/editor/RichTextEditor/utils/url.helper';

export type TabValue = 'url' | 'static' | 'category';

export const tabs: { value: TabValue; label: string }[] = [
  { value: 'url', label: 'URL' },
  { value: 'static', label: 'Static page' },
  { value: 'category', label: 'Category' },
];

export const useLinkModal = (editor: Ref<Editor | null | undefined> | ComputedRef<Editor | null | undefined>) => {
  const activeTab = ref<TabValue>('url');
  const urlValue = ref('');
  const staticPageValue = ref('');
  const openInNewWindow = ref(false);
  const categoryValue = ref<string | null>(null);
  const selectedCategoryPath = ref<string | null>(null);
  const linkText = ref('');

  const { getCorrectPreviewPathWithLocale } = useCategoryIdHelper();

  const categoryHref = computed(() => {
    if (!selectedCategoryPath.value) return '';
    return getCorrectPreviewPathWithLocale(selectedCategoryPath.value);
  });

  const selectedText = computed(() => {
    if (!editor.value) return '';
    const { from, to } = editor.value.state.selection;
    return editor.value.state.doc.textBetween(from, to, ' ');
  });

  const initialSelection = ref<{ from: number; to: number } | null>(null);
  const initialText = ref('');

  const initFromEditor = () => {
    linkText.value = selectedText.value;
    initialText.value = selectedText.value;
    if (!editor.value) return;
    const { from, to } = editor.value.state.selection;
    initialSelection.value = { from, to };
    const attrs = editor.value.getAttributes('link');
    if (attrs.href) {
      urlValue.value = attrs.href;
      openInNewWindow.value = attrs.target === '_blank';
    }
  };

  const applyLivePreview = () => {
    if (!editor.value || !initialSelection.value) return;

    const href = computedHref.value;
    const isExternalUrl = activeTab.value === 'url';
    const target = isExternalUrl || openInNewWindow.value ? '_blank' : '_self';
    const text = linkText.value.trim() || initialText.value;
    const { from } = initialSelection.value;
    const chain = editor.value.chain();

    chain.setTextSelection(initialSelection.value).deleteSelection().insertContent(text);

    initialSelection.value = { from, to: from + text.length };

    chain.setTextSelection(initialSelection.value);

    if (href) {
      chain.setLink({ href, target });
    } else {
      chain.unsetLink();
    }

    chain.run();
  };

  watch([linkText, urlValue, staticPageValue, categoryValue, openInNewWindow], applyLivePreview);

  const computedHref = computed(() => {
    if (activeTab.value === 'url') return urlValue.value.trim();
    if (activeTab.value === 'static') return staticPageValue.value;
    if (activeTab.value === 'category') return categoryHref.value;
    return '';
  });

  const canSubmit = computed(() => {
    if (activeTab.value === 'url') return validateUrl(urlValue.value);
    if (activeTab.value === 'category') return Boolean(categoryHref.value);
    return Boolean(computedHref.value);
  });

  const handleSubmit = (onClose: () => void) => {
    if (!canSubmit.value || !editor.value) return;
    // live preview already applied all changes, just confirm and close
    onClose();
  };

  const cancelAndRevert = (onClose: () => void) => {
    if (editor.value && initialSelection.value) {
      const chain = editor.value.chain();
      chain.setTextSelection(initialSelection.value).deleteSelection().insertContent(initialText.value);

      const { from } = initialSelection.value;
      const to = from + initialText.value.length;
      chain.setTextSelection({ from, to });

      const originalAttrs = editor.value.getAttributes('link');
      if (originalAttrs.href) {
        chain.setLink({ href: originalAttrs.href, target: originalAttrs.target });
      } else {
        chain.unsetLink();
      }

      chain.run();
    }
    onClose();
  };
  return {
    activeTab,
    urlValue,
    staticPageValue,
    categoryValue,
    selectedCategoryPath,
    openInNewWindow,
    linkText,
    computedHref,
    canSubmit,
    tabs,
    initFromEditor,
    handleSubmit,
    cancelAndRevert,
  };
};
