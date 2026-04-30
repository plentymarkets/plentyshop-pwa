import type { EditorTarget } from '~/composables/useEditorOptionsTabs/types';
import type { TranslateFn } from '~/composables/useItemDataTable/types';

export const useTextboxOptions = (getTarget: () => EditorTarget, t: TranslateFn) => {
  const textboxAlignXOptions = computed(() => [
    { value: 'left' as AlignX, label: t('textbox-align-x-left-label'), testId: 'slider-textbox-align-x-left' },
    { value: 'center' as AlignX, label: t('textbox-align-x-center-label'), testId: 'slider-textbox-align-x-center' },
    { value: 'right' as AlignX, label: t('textbox-align-x-right-label'), testId: 'slider-textbox-align-x-right' },
  ]);

  const textboxAlignXModel = computed<AlignX>({
    get: () => getTarget()?.text?.justify ?? 'left',
    set: (newAlignXValue) => {
      const target = getTarget();
      if (target?.text) target.text.justify = newAlignXValue;
    },
  });

  const textboxAlignYOptions = computed(() => [
    { value: 'top' as AlignY, label: t('textbox-align-y-top-label'), testId: 'slider-textbox-align-y-top' },
    { value: 'center' as AlignY, label: t('textbox-align-y-center-label'), testId: 'slider-textbox-align-y-center' },
    { value: 'bottom' as AlignY, label: t('textbox-align-y-bottom-label'), testId: 'slider-textbox-align-y-bottom' },
  ]);

  const textboxAlignYModel = computed<AlignY>({
    get: () => getTarget()?.text?.align ?? 'top',
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
