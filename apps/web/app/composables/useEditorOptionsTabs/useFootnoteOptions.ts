import type { EditorTarget, TranslateFn } from '~/composables/useEditorOptionsTabs/types';

export function useFootnoteOptions(getTarget: () => EditorTarget, t: TranslateFn) {
  const footnoteAlignOptions = computed(() => [
    {
      value: 'left' as FootnoteAlign,
      label: t('footnotes-align-option-left-label'),
      testId: 'footnoteAlign-textbox-y-align-left',
    },
    {
      value: 'center' as FootnoteAlign,
      label: t('footnotes-align-option-center-label'),
      testId: 'footnoteAlign-textbox-y-align-center',
    },
    {
      value: 'right' as FootnoteAlign,
      label: t('footnotes-align-option-right-label'),
      testId: 'footnoteAlign-textbox-y-align-right',
    },
  ]);

  const footnoteAlignModel = computed<FootnoteAlign>({
    get: () => getTarget()?.content?.footnoteAlign ?? 'left',
    set: (v) => {
      const target = getTarget();
      if (target?.content) target.content.footnoteAlign = v;
    },
  });

  return {
    footnoteAlignModel,
    footnoteAlignOptions,
  };
}
