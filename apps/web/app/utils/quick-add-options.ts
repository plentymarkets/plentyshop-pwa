import type { QuickAddOption } from '~/components/editor/QuickAdd/types';

export const headerQuickAddOptions: QuickAddOption[] = [
  { blockName: 'UtilityBar', label: getBlockDisplayName('UtilityBar'), category: 'header', variationIndex: 0 },
  { blockName: 'Navigation', label: getBlockDisplayName('Navigation'), category: 'header', variationIndex: 1 },
  {
    blockName: 'AnnouncementBar',
    label: getBlockDisplayName('AnnouncementBar'),
    category: 'header',
    variationIndex: 2,
  },
];
const sharedFooterAndMultiGridQuickAddOptions: QuickAddOption[] = [
  { blockName: 'Image', label: getBlockDisplayName('Image'), category: 'image', variationIndex: 0 },
  { blockName: 'TextCard', label: getBlockDisplayName('TextCard'), category: 'text', variationIndex: 0 },
];

const gridRowOption: QuickAddOption = {
  blockName: 'MultiGrid',
  label: 'Grid',
  category: 'row',
  variationIndex: 0,
  type: 'row',
};

export const footerQuickAddOptions: QuickAddOption[] = sharedFooterAndMultiGridQuickAddOptions.map((option) => ({
  ...option,
}));
export const multiGridQuickAddOptions: QuickAddOption[] = [
  ...sharedFooterAndMultiGridQuickAddOptions.map((option) => ({ ...option })),
  gridRowOption,
];
