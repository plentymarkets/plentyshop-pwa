import type { EditorTarget, TranslateFn } from '~/composables/useEditorOptionsTabs/types';

export function useTextboxOptions(getTarget: () => EditorTarget, t: TranslateFn) {
  const textboxAlignXOptions = computed(() => [
    { value: 'left' as AlignX, label: t('textbox-align-x-left-label'), testId: 'slider-textbox-align-x-left' },
    { value: 'center' as AlignX, label: t('textbox-align-x-center-label'), testId: 'slider-textbox-align-x-center' },
    { value: 'right' as AlignX, label: t('textbox-align-x-right-label'), testId: 'slider-textbox-align-x-right' },
  ]);

  const textboxAlignXModel = computed<AlignX>({
    get: () => getTarget()?.text?.align ?? 'left',
    set: (v) => {
      const target = getTarget();
      if (target?.text) target.text.align = v;
    },
  });

  const textboxAlignYOptions = computed(() => [
    { value: 'top' as AlignY, label: t('textbox-align-y-top-label'), testId: 'slider-textbox-align-y-top' },
    { value: 'center' as AlignY, label: t('textbox-align-y-center-label'), testId: 'slider-textbox-align-y-center' },
    { value: 'bottom' as AlignY, label: t('textbox-align-y-bottom-label'), testId: 'slider-textbox-align-y-bottom' },
  ]);

  const textboxAlignYModel = computed<AlignY>({
    get: () => getTarget()?.text?.justify ?? 'top',
    set: (v) => {
      const target = getTarget();
      if (target?.text) target.text.justify = v;
    },
  });

  return {
    textboxAlignXModel,
    textboxAlignXOptions,
    textboxAlignYModel,
    textboxAlignYOptions,
  };
}
