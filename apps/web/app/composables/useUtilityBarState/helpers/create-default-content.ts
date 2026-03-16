import type {
  UtilityBarContent,
  SectionType,
  ActionType,
  SpacingSettings,
  UtilityBarColor,
} from '~/components/blocks/UtilityBar/types';

export const DEFAULT_LAYOUT: SpacingSettings = {
  paddingTop: 20,
  paddingBottom: 20,
  paddingLeft: 40,
  paddingRight: 40,
};

export const DEFAULT_COLOR: UtilityBarColor = {
  iconColor: '#fff',
  backgroundColor: 'rgb(var(--colors-2-primary-500))',
};

export const DEFAULT_SECTION_ORDER: SectionType[] = ['logo', 'search', 'actions'];

export const DEFAULT_SECTION_VISIBILITY: Record<SectionType, boolean> = {
  logo: true,
  search: true,
  actions: true,
};

export const DEFAULT_ACTION_ORDER: ActionType[] = ['language', 'wishlist', 'cart', 'account'];

export const DEFAULT_ACTION_VISIBILITY: Record<ActionType, boolean> = {
  language: true,
  wishlist: true,
  cart: true,
  account: true,
};

export const createDefaultContent = (): UtilityBarContent => ({
  layout: { ...DEFAULT_LAYOUT },
  sectionOrder: { sections: [...DEFAULT_SECTION_ORDER] },
  sectionVisibility: { ...DEFAULT_SECTION_VISIBILITY },
  color: { ...DEFAULT_COLOR },
  logo: { logo: '' },
  search: { displayMode: 'full' },
  actions: {
    order: [...DEFAULT_ACTION_ORDER],
    visibility: { ...DEFAULT_ACTION_VISIBILITY },
  },
});
