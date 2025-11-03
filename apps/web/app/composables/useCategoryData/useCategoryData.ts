import { clamp } from '@storefront-ui/shared';
import { categoryGetters, type Category } from '@plentymarkets/shop-api';
import type { CategoryDataContent, CategoryDataFieldKey } from '~/components/blocks/CategoryData/types';

declare const getEditorTranslation: (key: string) => string;

export const useCategoryData = () => {
  const route = useRoute();
  const { data } = useCategoryTemplate(route?.meta?.identifier as string, route.meta.type as string);

  const { blockUuid } = useSiteConfiguration();
  const { findOrDeleteBlockByUuid } = useBlockManager();
  const { data: productsCatalog } = useProducts();
  const { t } = useI18n();

  const learnMoreUrl: string = 'https://knowledge.plentymarkets.com/en-gb/manual/main/item/categories.html#900';
  const learnMoreTextUrl: string = 'https://knowledge.plentymarkets.com/en-gb/manual/main/item/categories.html#800';

  const categoryDataBlock = computed(
    () => findOrDeleteBlockByUuid(data.value, blockUuid.value)?.content as CategoryDataContent,
  );

  const isBlank = (v: string | null | undefined): boolean => v == null || v.trim() === '';

  const IMAGE_KEYS = ['wideScreen', 'desktop', 'tablet', 'mobile'] as const;
  type ImageKey = (typeof IMAGE_KEYS)[number];

  const hasAnyLinkedImage = computed<boolean>(() => {
    const img = categoryDataBlock.value?.image as Partial<Record<ImageKey, string | null | undefined>> | undefined;
    if (!img) return false;
    return IMAGE_KEYS.some((k) => !isBlank(img[k]));
  });

  const showImageSlotHint = computed<boolean>(
    () => categoryDataBlock.value.displayCategoryImage !== 'off' && !hasAnyLinkedImage.value,
  );

  const category = computed<Category>(() => productsCatalog.value?.category || ({} as Category));

  const getFieldText = (key: CategoryDataFieldKey): string => {
    switch (key) {
      case 'name':
        return categoryGetters.getCategoryName(category.value) ?? '';
      case 'description1':
        return categoryGetters.getCategoryDescription1(category.value) ?? '';
      case 'description2':
        return categoryGetters.getCategoryDescription2(category.value) ?? '';
      case 'shortDescription':
        return categoryGetters.getCategoryShortDescription(category.value) ?? '';
    }
  };

  const fieldLabels: Record<CategoryDataFieldKey, string> = {
    name: getEditorTranslation('category-name'),
    description1: getEditorTranslation('category-description-1'),
    description2: getEditorTranslation('category-description-2'),
    shortDescription: getEditorTranslation('short-description'),
  };

  const missingTextFieldKeys = computed<CategoryDataFieldKey[]>(() => {
    const order = categoryDataBlock.value.fieldsOrder as CategoryDataFieldKey[];
    return order.filter((key) => {
      const isEnabled = categoryDataBlock.value.fields[key];
      const isDisabled = categoryDataBlock.value.fieldsDisabled?.includes(key);
      if (!isEnabled || isDisabled) return false;
      return isBlank(getFieldText(key));
    });
  });

  const missingTextLabels = computed(() => missingTextFieldKeys.value.map((k) => fieldLabels[k]).join(', '));

  const showTextHint = computed<boolean>(() => missingTextFieldKeys.value.length > 0);

  const fieldsEmptyHintText = computed<string>(() => {
    const count = missingTextFieldKeys.value.length;
    if (count === 1) {
      const onlyKey = missingTextFieldKeys.value[0]!;
      const onlyLabel = (fieldLabels as Record<CategoryDataFieldKey, string>)[onlyKey];
      return t('field-empty-hint-prefix', { field: onlyLabel });
    }
    return t('fields-empty-hint-prefix', { fields: missingTextLabels.value });
  });

  const clampBrightness = (event: Event, type: 'image' | 'text') => {
    const currentValue = (event.target as HTMLInputElement)?.value;
    const nextValue = Number.parseFloat(currentValue);
    if (type === 'image') categoryDataBlock.value.image.brightness = clamp(nextValue, 0, 1);
    if (type === 'text') categoryDataBlock.value.text.bgOpacity = clamp(nextValue, 0, 1);
  };

  const changeCategoryImageWidth = (fullWidth: boolean) => {
    categoryDataBlock.value.layout.narrowContainer = !fullWidth;
    setTimeout(() => {
      const el = document.querySelector(`[data-uuid="${blockUuid.value}"]`);
      if (!el) return;
      if (fullWidth) el.classList.remove('max-w-screen-3xl', 'px-4', 'md:px-6');
      else el.classList.add('max-w-screen-3xl');
    }, 100);
  };

  onMounted(() => {
    watch(
      () => categoryDataBlock.value.image?.fillMode,
      (newMode) => {
        if (newMode === 'fill') {
          categoryDataBlock.value.layout.paddingTop = 0;
          categoryDataBlock.value.layout.paddingBottom = 0;
          categoryDataBlock.value.layout.paddingLeft = 0;
          categoryDataBlock.value.layout.paddingRight = 0;
          changeCategoryImageWidth(true);
        } else if (newMode === 'fit') {
          changeCategoryImageWidth(false);
        }
      },
      { immediate: true, flush: 'post' },
    );
  });

  return {
    learnMoreUrl,
    learnMoreTextUrl,
    categoryDataBlock,
    fieldLabels,
    hasAnyLinkedImage,
    showImageSlotHint,
    showTextHint,
    fieldsEmptyHintText,
    clampBrightness,
  };
};
