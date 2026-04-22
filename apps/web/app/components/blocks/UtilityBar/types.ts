export type SpacingSettings = {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
};

export type LogoSettings = {
  logo: string;
};

export type UtilityBarSection = {
  id: SectionType;
  name: string;
  visible: boolean;
};

export type ActionOrderItem = {
  id: ActionType;
  visible: boolean;
};

export type SearchDisplayMode = 'icon-only' | 'full';

export type SearchSettings = {
  displayMode: SearchDisplayMode;
};

export type ActionType = 'language' | 'wishlist' | 'cart' | 'account';

export type ActionsSettings = {
  order: ActionType[];
  visibility: {
    language: boolean;
    wishlist: boolean;
    cart: boolean;
    account: boolean;
  };
};

export type SectionType = 'logo' | 'search' | 'actions';

export type SectionOrderSettings = {
  sections: SectionType[];
};

export type UtilityBarColor = {
  iconColor: string;
  backgroundColor: string;
};

export type UtilityBarContent = {
  layout: SpacingSettings;
  sectionOrder: SectionOrderSettings;
  sectionVisibility?: Record<SectionType, boolean>;
  color: UtilityBarColor;
  logo: LogoSettings;
  search: SearchSettings;
  actions: ActionsSettings;
};

export type UtilityBarProps = {
  name: string;
  type: string;
  content: UtilityBarContent;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type UtilityBarFormProps = {
  uuid?: string;
};
