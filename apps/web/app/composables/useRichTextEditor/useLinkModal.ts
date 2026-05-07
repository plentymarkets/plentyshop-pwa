import type { Editor } from '@tiptap/core';
import { userGetters } from '@plentymarkets/shop-api';

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

  const initFromEditor = () => {
    linkText.value = selectedText.value;
    if (!editor.value) return;
    const attrs = editor.value.getAttributes('link');
    if (attrs.href) {
      urlValue.value = attrs.href;
      openInNewWindow.value = attrs.target === '_blank';
    }
  };

  const computedHref = computed(() => {
    if (activeTab.value === 'url') return urlValue.value.trim();
    if (activeTab.value === 'static') return staticPageValue.value;
    if (activeTab.value === 'category') return categoryHref.value;
    return '';
  });

  const canSubmit = computed(() => {
    if (activeTab.value === 'url') return userGetters.isValidUrl(urlValue.value);
    if (activeTab.value === 'category') return Boolean(categoryHref.value);
    return Boolean(computedHref.value);
  });

  const handleSubmit = (onClose: () => void) => {
    if (!canSubmit.value || !editor.value) return;

    const href = computedHref.value;
    const target = openInNewWindow.value ? '_blank' : '_self';
    const text = linkText.value.trim();
    const chain = editor.value.chain().focus();
    const { from, to } = editor.value.state.selection;
    const currentText = editor.value.state.doc.textBetween(from, to, ' ');

    if (text && text !== currentText) {
      chain.insertContent(`<a href="${href}" target="${target}">${text}</a>`);
    } else {
      chain.setLink({ href, target });
    }

    chain.run();
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
  };
};
