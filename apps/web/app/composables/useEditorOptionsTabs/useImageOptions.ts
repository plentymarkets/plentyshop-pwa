import type { EditorTarget, TranslateFn, FillMode } from '~/composables/useEditorOptionsTabs/types';

export function useImageOptions(getTarget: () => EditorTarget, t: TranslateFn) {
  const fillModeOptions = computed(() => [
    { value: 'fill' as FillMode, label: t('image-scalling-fill-label'), testId: 'image-scaling-fill' },
    { value: 'fit' as FillMode, label: t('image-scalling-fit-label'), testId: 'image-scaling-fit' },
  ]);

  const fillModeModel = computed({
    get: (): FillMode => (getTarget()?.image?.fillMode ?? 'fit') as FillMode,
    set: (v: FillMode) => {
      const target = getTarget();
      if (target?.image) target.image.fillMode = v;
    },
  });

  const displayCategoryImageOptions = computed(() => [
    { value: 'off' as DisplayCategoryImage, label: t('off'), testId: 'display-category-image-off' },
    { value: 'image-1' as DisplayCategoryImage, label: t('image-1'), testId: 'display-category-image-1' },
    { value: 'image-2' as DisplayCategoryImage, label: t('image-2'), testId: 'display-category-image-2' },
  ]);

  const displayCategoryImageModel = computed<DisplayCategoryImage>({
    get: () => getTarget()?.displayCategoryImage ?? 'off',
    set: (v) => {
      const target = getTarget();
      if (target) target.displayCategoryImage = v;
    },
  });

  return {
    fillModeModel,
    fillModeOptions,
    displayCategoryImageModel,
    displayCategoryImageOptions,
  };
}
