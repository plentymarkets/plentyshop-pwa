import type { Editor } from '@tiptap/core';
import { validateUrl } from '~/composables/useRichTextEditor/helpers/url.helper';
import type { LinkModalLinkAttrs } from '~/composables/useRichTextEditor/types';

export const useLinkModal = (editor: Ref<Editor | null | undefined> | ComputedRef<Editor | null | undefined>) => {
  const tabs: { value: LinkTabValue; label: string }[] = [
    { value: 'url', label: 'URL' },
    { value: 'static', label: 'Static page' },
    { value: 'category', label: 'Category' },
  ];

  const activeTab = ref<LinkTabValue>('url');
  const urlValue = ref('');
  const staticPageValue = ref('');
  const openInNewWindow = ref(false);
  const categoryValue = ref<string | null>(null);
  const selectedCategoryPath = ref<string | null>(null);
  const linkText = ref('');

  const { getCorrectPreviewPathWithLocale } = useCategoryIdHelper();

  const initialLinkAttrs = ref<LinkModalLinkAttrs | null>(null);

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

  const isCategoryHref = (href: string) => {
    return href.includes('/c/') || href.includes('/category/');
  };

  const isStaticPageHref = (href: string) => {
    return href.startsWith('/') && !isCategoryHref(href);
  };

  const isInitializing = ref(false);

  const initFromEditor = () => {
    if (!editor.value) return;
    isInitializing.value = true;

    const { from, to } = editor.value.state.selection;
    initialSelection.value = { from, to };

    linkText.value = selectedText.value;
    initialText.value = selectedText.value;

    const attrs = editor.value.getAttributes('link') as LinkModalLinkAttrs;
    initialLinkAttrs.value = {
      href: attrs.href,
      target: attrs.target,
      'data-link-type': attrs['data-link-type'],
      'data-link-value': attrs['data-link-value'],
      'data-link-path': attrs['data-link-path'],
    };

    if (attrs.href) {
      openInNewWindow.value = attrs.target === '_blank';

      const storedLinkType = attrs['data-link-type'] as LinkTabValue | undefined;
      const storedLinkValue = attrs['data-link-value'] as string | undefined;
      const storedLinkPath = attrs['data-link-path'] as string | undefined;

      if (storedLinkType) {
        activeTab.value = storedLinkType;
        if (storedLinkType === 'url' && storedLinkValue) {
          urlValue.value = storedLinkValue;
        } else if (storedLinkType === 'static' && storedLinkValue) {
          staticPageValue.value = storedLinkValue;
        } else if (storedLinkType === 'category') {
          categoryValue.value = storedLinkValue ?? attrs.href ?? null;
          selectedCategoryPath.value = storedLinkPath || attrs.href || null;
        }
      } else {
        if (isCategoryHref(attrs.href)) {
          activeTab.value = 'category';
          categoryValue.value = attrs.href;
          selectedCategoryPath.value = attrs.href;
        } else if (isStaticPageHref(attrs.href)) {
          activeTab.value = 'static';
          staticPageValue.value = attrs.href;
        } else {
          activeTab.value = 'url';
          urlValue.value = attrs.href;
        }
      }
    }
    nextTick(() => {
      isInitializing.value = false;
    });
  };

  const applyLivePreview = () => {
    if (isInitializing.value) return;
    if (!editor.value || !initialSelection.value) return;

    const href = computedHref.value;
    const target = openInNewWindow.value ? '_blank' : '_self';
    const text = linkText.value.trim() || initialText.value;
    const { from } = initialSelection.value;
    const chain = editor.value.chain();

    chain.setTextSelection(initialSelection.value).deleteSelection().insertContent(text);

    initialSelection.value = { from, to: from + text.length };

    chain.setTextSelection(initialSelection.value);

    if (href) {
      const linkAttrs: { href: string; target: string } & LinkModalLinkAttrs = { href, target };

      linkAttrs['data-link-type'] = activeTab.value;

      if (activeTab.value === 'url') {
        linkAttrs['data-link-value'] = urlValue.value.trim();
      } else if (activeTab.value === 'static') {
        linkAttrs['data-link-value'] = staticPageValue.value;
      } else if (activeTab.value === 'category') {
        if (categoryValue.value) {
          linkAttrs['data-link-value'] = categoryValue.value;
        }
        if (selectedCategoryPath.value) {
          linkAttrs['data-link-path'] = selectedCategoryPath.value;
        }
      }

      chain.setLink(linkAttrs);
    } else {
      chain.unsetLink();
    }

    chain.run();
  };

  watch(
    [linkText, urlValue, staticPageValue, categoryValue, selectedCategoryPath, openInNewWindow, activeTab],
    applyLivePreview,
  );
  const computedHref = computed(() => {
    if (activeTab.value === 'url') return urlValue.value.trim();

    if (activeTab.value === 'static') {
      return staticPageValue.value ? getCorrectPreviewPathWithLocale(staticPageValue.value) : '';
    }

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
    onClose();
  };

  const cancelAndRevert = (onClose: () => void) => {
    if (editor.value && initialSelection.value) {
      const { from } = initialSelection.value;
      const to = from + initialText.value.length;

      const chain = editor.value.chain();

      chain
        .setTextSelection(initialSelection.value)
        .deleteSelection()
        .insertContent(initialText.value)
        .setTextSelection({ from, to });

      if (initialLinkAttrs.value?.href) {
        const initialHref = initialLinkAttrs.value.href;
        const linkAttrs: { href: string; target?: string } & LinkModalLinkAttrs = {
          href: initialHref,
          target: initialLinkAttrs.value.target,
          'data-link-type': initialLinkAttrs.value['data-link-type'],
          'data-link-value': initialLinkAttrs.value['data-link-value'],
          'data-link-path': initialLinkAttrs.value['data-link-path'],
        };

        chain.setLink(linkAttrs);
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
