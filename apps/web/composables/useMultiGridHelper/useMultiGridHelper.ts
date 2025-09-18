import { computed } from 'vue';

export interface MultiGridLayout {
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  backgroundColor: string;
  gap: string;
}

export function useMultiGridHelper(layout?: Partial<MultiGridLayout>, getBlockSize?: () => string) {
  const blockSize = computed(() => (getBlockSize ? getBlockSize() : 'm'));
  const defaultMarginBottom = computed(() => {
    switch (blockSize.value) {
      case 's':
        return 30;
      case 'm':
        return 40;
      case 'l':
        return 50;
      case 'xl':
        return 60;
      default:
        return 0;
    }
  });

  const DEFAULT_LAYOUT: MultiGridLayout = {
    marginTop: 0,
    marginBottom: defaultMarginBottom.value,
    marginLeft: 40,
    marginRight: 40,
    backgroundColor: '#ffffff',
    gap: 'M',
  };

  const safeLayout = computed<MultiGridLayout>(() => ({
    ...DEFAULT_LAYOUT,
    ...(layout ?? {}),
    marginBottom: layout?.marginBottom ?? DEFAULT_LAYOUT.marginBottom,
  }));

  const gridInlineStyle = computed(() => ({
    backgroundColor: safeLayout.value.backgroundColor,
    marginTop: `${safeLayout.value.marginTop}px`,
    marginBottom: `${safeLayout.value.marginBottom}px`,
    marginLeft: `${safeLayout.value.marginLeft}px`,
    marginRight: `${safeLayout.value.marginRight}px`,
  }));

  return {
    defaultMarginBottom,
    safeLayout,
    gridInlineStyle,
  };
}
