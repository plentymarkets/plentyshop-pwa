import type { EditorTarget } from '~/composables/useEditorOptionsTabs/types';
import type { TranslateFn } from '~/composables/useItemDataTable/types';

export const useFootnoteOptions = (getTarget: () => EditorTarget, t: TranslateFn) => {
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
    set: (newFootnoteAlign) => {
      const target = getTarget();
      if (target?.content) target.content.footnoteAlign = newFootnoteAlign;
    },
  });

  return {
    footnoteAlignModel,
    footnoteAlignOptions,
  };
};
