import type { EditorTarget, TranslateFn, FillMode } from '~/composables/useEditorOptionsTabs/types';

export function useEditorOptionsTabs(getTarget: () => EditorTarget, t: TranslateFn) {
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
  const textAlignOptions = computed(() => [
    { value: 'left' as AlignX, label: t('text-align-option-left-label'), testId: 'slider-text-align-left' },
    { value: 'center' as AlignX, label: t('text-align-option-center-label'), testId: 'slider-text-align-center' },
    { value: 'right' as AlignX, label: t('text-align-option-right-label'), testId: 'slider-text-align-right' },
  ]);
  const textAlignModel = computed<AlignX>({
    get: () => getTarget()?.text?.textAlignment ?? 'left',
    set: (v) => {
      const target = getTarget();
      if (target?.text) target.text.textAlignment = v;
    },
  });
  const textOverlayAlignXOptions = computed(() => [
    { value: 'left' as AlignX, label: t('text-overlay-align-x-left'), testId: 'text-overlay-align-x-left' },
    { value: 'center' as AlignX, label: t('text-overlay-align-x-center'), testId: 'text-overlay-align-x-center' },
    { value: 'right' as AlignX, label: t('text-overlay-align-x-right'), testId: 'text-overlay-align-x-right' },
  ]);
  const textOverlayAlignXModel = computed<AlignX>({
    get: () => getTarget()?.text?.textOverlayAlignX ?? 'left',
    set: (v) => {
      const target = getTarget();
      if (target?.text) target.text.textOverlayAlignX = v;
    },
  });

  const textOverlayAlignYOptions = computed(() => [
    { value: 'top' as AlignY, label: t('text-overlay-align-y-top'), testId: 'text-overlay-align-y-top' },
    { value: 'center' as AlignY, label: t('text-overlay-align-y-center'), testId: 'text-overlay-align-y-center' },
    { value: 'bottom' as AlignY, label: t('text-overlay-align-y-bottom'), testId: 'text-overlay-align-y-bottom' },
  ]);
  const textOverlayAlignYModel = computed<AlignY>({
    get: () => getTarget()?.text?.textOverlayAlignY ?? 'top',
    set: (v) => {
      const target = getTarget();
      if (target?.text) target.text.textOverlayAlignY = v;
    },
  });

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
    set: (v) => {
      const target = getTarget();
      if (target?.button) target.button.variant = v;
    },
  });
  const buttonAlignOptions = computed(() => [
    { value: 'left' as AlignX, label: t('button-align-option-left-label'), testId: 'slider-button-align-left' },
    { value: 'center' as AlignX, label: t('button-align-option-center-label'), testId: 'slider-button-align-center' },
    { value: 'right' as AlignX, label: t('button-align-option-right-label'), testId: 'slider-button-align-right' },
  ]);
  const buttonAlignModel = computed<AlignX>({
    get: () => getTarget()?.button?.alignment ?? 'left',
    set: (v) => {
      const target = getTarget();
      if (target?.button) target.button.alignment = v;
    },
  });
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

  const itemCountPositionOptions = computed(() => [
    { value: 'left' as ItemCountPosition, label: t('position-left'), testId: 'item-count-left' },
    { value: 'center' as ItemCountPosition, label: t('position-center'), testId: 'item-count-center' },
    { value: 'right' as ItemCountPosition, label: t('position-right'), testId: 'item-count-right' },
  ]);
  const itemCountPositionModel = computed<ItemCountPosition>({
    get: () => getTarget()?.itemCountPosition ?? 'left',
    set: (v) => {
      const target = getTarget();
      if (target) target.itemCountPosition = v;
    },
  });

  const contentAlignmentOptions = computed(() => [
    { value: 'left' as ContentAlignment, label: t('position-left'), testId: 'content-align-left' },
    { value: 'center' as ContentAlignment, label: t('position-center'), testId: 'content-align-center' },
    { value: 'right' as ContentAlignment, label: t('position-right'), testId: 'content-align-right' },
  ]);
  const contentAlignmentModel = computed<ContentAlignment>({
    get: () => getTarget()?.contentAlignment ?? 'left',
    set: (v) => {
      const target = getTarget();
      if (target) target.contentAlignment = v;
    },
  });

  const addToCartStyleOptions = computed(() => [
    { value: 'primary' as AddToCartStyle, label: t('button-primary'), testId: 'add-to-cart-primary' },
    { value: 'secondary' as AddToCartStyle, label: t('button-secondary'), testId: 'add-to-cart-secondary' },
  ]);
  const addToCartStyleModel = computed<AddToCartStyle>({
    get: () => getTarget()?.addToCartStyle ?? 'primary',
    set: (v) => {
      const target = getTarget();
      if (target) target.addToCartStyle = v;
    },
  });

  const wishlistSizeOptions = computed(() => [
    { value: 'small' as WishlistSize, label: t('wishlist-size-small'), testId: 'wishlist-size-small' },
    { value: 'large' as WishlistSize, label: t('wishlist-size-large'), testId: 'wishlist-size-large' },
  ]);
  const wishlistSizeModel = computed<WishlistSize>({
    get: () => getTarget()?.wishlistSize ?? 'small',
    set: (v) => {
      const target = getTarget();
      if (target) target.wishlistSize = v;
    },
  });

  const sourceTypeOptions = computed(() => [
    {
      value: 'cross_selling' as SourceType,
      label: t('source-type-product'),
      testId: 'recommended-form-source-product',
    },
    { value: 'category' as SourceType, label: t('source-type-category'), testId: 'recommended-form-source-category' },
  ]);
  const sourceTypeModel = computed<SourceType>({
    get: () => getTarget()?.source?.type ?? 'category',
    set: (v) => {
      const target = getTarget();
      if (target?.source) target.source.type = v;
    },
  });

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
    textboxAlignXModel,
    textboxAlignXOptions,
    textboxAlignYModel,
    textboxAlignYOptions,
    textAlignModel,
    textAlignOptions,
    textOverlayAlignXModel,
    textOverlayAlignXOptions,
    textOverlayAlignYModel,
    textOverlayAlignYOptions,
    buttonVariantModel,
    buttonVariantOptions,
    buttonAlignModel,
    buttonAlignOptions,
    fillModeModel,
    fillModeOptions,
    displayCategoryImageModel,
    displayCategoryImageOptions,
    itemCountPositionModel,
    itemCountPositionOptions,
    contentAlignmentModel,
    contentAlignmentOptions,
    addToCartStyleModel,
    addToCartStyleOptions,
    wishlistSizeModel,
    wishlistSizeOptions,
    sourceTypeModel,
    sourceTypeOptions,
    footnoteAlignModel,
    footnoteAlignOptions,
  };
}
