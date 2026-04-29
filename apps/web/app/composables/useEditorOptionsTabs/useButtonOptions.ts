import type { EditorTarget } from '~/composables/useEditorOptionsTabs/types';
import type { TranslateFn } from '~/composables/useItemDataTable/types';

export const useButtonOptions = (getTarget: () => EditorTarget, t: TranslateFn) => {
  const buttonVariantOptions = computed(() => [
    { value: 'primary' as ButtonVariant, label: t('button-variant-primary-label'), testId: 'slider-button-primary' },
    {
      value: 'secondary' as ButtonVariant,
      label: t('button-variant-secondary-label'),
      testId: 'slider-button-secondary',
    },
  ]);

  const buttonVariantModel = computed<ButtonVariant>({
    get: () => getTarget()?.button?.variant ?? 'primary',
    set: (newButtonVariant) => {
      const target = getTarget();
      if (target?.button) target.button.variant = newButtonVariant;
    },
  });

  const buttonAlignOptions = computed(() => [
    { value: 'left' as AlignX, label: t('button-align-option-left-label'), testId: 'slider-button-align-left' },
    { value: 'center' as AlignX, label: t('button-align-option-center-label'), testId: 'slider-button-align-center' },
    { value: 'right' as AlignX, label: t('button-align-option-right-label'), testId: 'slider-button-align-right' },
  ]);

  const buttonAlignModel = computed<AlignX>({
    get: () => getTarget()?.button?.alignment ?? 'left',
    set: (newButtonAlignValue) => {
      const target = getTarget();
      if (target?.button) target.button.alignment = newButtonAlignValue;
    },
  });

  return {
    buttonVariantModel,
    buttonVariantOptions,
    buttonAlignModel,
    buttonAlignOptions,
  };
};
