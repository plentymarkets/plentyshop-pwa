export type SpacingSettings = {
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
};

export type ColorSettings = {
  headerBackgroundColor: string;
  iconColor: string;
};

export type LogoSettings = {
  logo: string;
};

export type UtilityBarSection = {
  id: SectionType;
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

export type UtilityBarProps = {
  name: string;
  type: string;
  configuration: {
    layout: SpacingSettings;
    colors: ColorSettings;
    sectionOrder: SectionOrderSettings;
    sectionVisibility?: Record<SectionType, boolean>;
    logo: LogoSettings;
    search: SearchSettings;
    actions: ActionsSettings;
  };
  content?: unknown;
};
