import type { EditorTarget } from '~/composables/useEditorOptionsTabs/types';
import type { TranslateFn } from '~/composables/useItemDataTable/types';

export const useTextOptions = (getTarget: () => EditorTarget, t: TranslateFn) => {
  const textAlignOptions = computed(() => [
    { value: 'left' as AlignX, label: t('text-align-option-left-label'), testId: 'slider-text-align-left' },
    { value: 'center' as AlignX, label: t('text-align-option-center-label'), testId: 'slider-text-align-center' },
    { value: 'right' as AlignX, label: t('text-align-option-right-label'), testId: 'slider-text-align-right' },
  ]);

  const textAlignModel = computed<AlignX>({
    get: () => getTarget()?.text?.textAlignment ?? 'left',
    set: (newTextAlignValue) => {
      const target = getTarget();
      if (target?.text) target.text.textAlignment = newTextAlignValue;
    },
  });

  const textOverlayAlignXOptions = computed(() => [
    { value: 'left' as AlignX, label: t('text-overlay-align-x-left'), testId: 'text-overlay-align-x-left' },
    { value: 'center' as AlignX, label: t('text-overlay-align-x-center'), testId: 'text-overlay-align-x-center' },
    { value: 'right' as AlignX, label: t('text-overlay-align-x-right'), testId: 'text-overlay-align-x-right' },
  ]);

  const textOverlayAlignXModel = computed<AlignX>({
    get: () => getTarget()?.text?.textOverlayAlignX ?? 'left',
    set: (newOverlayAlignXValue) => {
      const target = getTarget();
      if (target?.text) target.text.textOverlayAlignX = newOverlayAlignXValue;
    },
  });

  const textOverlayAlignYOptions = computed(() => [
    { value: 'top' as AlignY, label: t('text-overlay-align-y-top'), testId: 'text-overlay-align-y-top' },
    { value: 'center' as AlignY, label: t('text-overlay-align-y-center'), testId: 'text-overlay-align-y-center' },
    { value: 'bottom' as AlignY, label: t('text-overlay-align-y-bottom'), testId: 'text-overlay-align-y-bottom' },
  ]);

  const textOverlayAlignYModel = computed<AlignY>({
    get: () => getTarget()?.text?.textOverlayAlignY ?? 'top',
    set: (newOverlayAlignYValue) => {
      const target = getTarget();
      if (target?.text) target.text.textOverlayAlignY = newOverlayAlignYValue;
    },
  });

  return {
    textAlignModel,
    textAlignOptions,
    textOverlayAlignXModel,
    textOverlayAlignXOptions,
    textOverlayAlignYModel,
    textOverlayAlignYOptions,
  };
};
