import type { EditorTarget } from '~/composables/useEditorOptionsTabs/types';
import type { TranslateFn } from '~/composables/useItemDataTable/types';

export const useProductOptions = (getTarget: () => EditorTarget, t: TranslateFn) => {
  const itemCountPositionOptions = computed(() => [
    { value: 'left' as ItemCountPosition, label: t('position-left'), testId: 'item-count-left' },
    { value: 'center' as ItemCountPosition, label: t('position-center'), testId: 'item-count-center' },
    { value: 'right' as ItemCountPosition, label: t('position-right'), testId: 'item-count-right' },
  ]);

  const itemCountPositionModel = computed<ItemCountPosition>({
    get: () => getTarget()?.itemCountPosition ?? 'left',
    set: (newItemCountPosition) => {
      const target = getTarget();
      if (target) target.itemCountPosition = newItemCountPosition;
    },
  });

  const contentAlignmentOptions = computed(() => [
    { value: 'left' as ContentAlignment, label: t('position-left'), testId: 'content-align-left' },
    { value: 'center' as ContentAlignment, label: t('position-center'), testId: 'content-align-center' },
    { value: 'right' as ContentAlignment, label: t('position-right'), testId: 'content-align-right' },
  ]);

  const contentAlignmentModel = computed<ContentAlignment>({
    get: () => getTarget()?.contentAlignment ?? 'left',
    set: (newContentAlignment) => {
      const target = getTarget();
      if (target) target.contentAlignment = newContentAlignment;
    },
  });

  const addToCartStyleOptions = computed(() => [
    { value: 'primary' as AddToCartStyle, label: t('button-primary'), testId: 'add-to-cart-primary' },
    { value: 'secondary' as AddToCartStyle, label: t('button-secondary'), testId: 'add-to-cart-secondary' },
  ]);

  const addToCartStyleModel = computed<AddToCartStyle>({
    get: () => getTarget()?.addToCartStyle ?? 'primary',
    set: (newAddToCartStyle) => {
      const target = getTarget();
      if (target) target.addToCartStyle = newAddToCartStyle;
    },
  });

  const wishlistSizeOptions = computed(() => [
    { value: 'small' as WishlistSize, label: t('wishlist-size-small'), testId: 'wishlist-size-small' },
    { value: 'large' as WishlistSize, label: t('wishlist-size-large'), testId: 'wishlist-size-large' },
  ]);

  const wishlistSizeModel = computed<WishlistSize>({
    get: () => getTarget()?.wishlistSize ?? 'small',
    set: (newWishlistSize) => {
      const target = getTarget();
      if (target) target.wishlistSize = newWishlistSize;
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
    set: (newSourceType) => {
      const target = getTarget();
      if (target?.source) target.source.type = newSourceType;
    },
  });

  return {
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
  };
};
