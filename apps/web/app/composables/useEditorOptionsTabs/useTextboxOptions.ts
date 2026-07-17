import type { EditorTarget, TextboxJustify, TextboxAlign, AlignOption } from '~/composables/useEditorOptionsTabs/types';
import type { TranslateFn } from '~/composables/useItemDataTable/types';

export const useTextboxOptions = (getTarget: () => EditorTarget, t: TranslateFn) => {
  const textboxAlignXOptions = computed(
    () =>
      [
        { value: 'top', label: t('textbox-align-main-top-label'), testId: 'slider-textbox-align-x-top' },
        { value: 'center', label: t('textbox-align-main-center-label'), testId: 'slider-textbox-align-x-center' },
        { value: 'bottom', label: t('textbox-align-main-bottom-label'), testId: 'slider-textbox-align-x-bottom' },
      ] satisfies AlignOption<TextboxJustify>[],
  );

  const textboxAlignXModel = computed<TextboxJustify>({
    get: () => getTarget()?.text?.justify ?? 'top',
    set: (newAlignXValue) => {
      const target = getTarget();
      if (target?.text) target.text.justify = newAlignXValue;
    },
  });

  const textboxAlignYOptions = computed(
    () =>
      [
        { value: 'left', label: t('textbox-align-cross-left-label'), testId: 'slider-textbox-align-y-left' },
        { value: 'center', label: t('textbox-align-cross-center-label'), testId: 'slider-textbox-align-y-center' },
        { value: 'right', label: t('textbox-align-cross-right-label'), testId: 'slider-textbox-align-y-right' },
      ] satisfies AlignOption<TextboxAlign>[],
  );

  const textboxAlignYModel = computed<TextboxAlign>({
    get: () => getTarget()?.text?.align ?? 'left',
    set: (newAlignYValue) => {
      const target = getTarget();
      if (target?.text) target.text.align = newAlignYValue;
    },
  });

  return {
    textboxAlignXModel,
    textboxAlignXOptions,
    textboxAlignYModel,
    textboxAlignYOptions,
  };
};
