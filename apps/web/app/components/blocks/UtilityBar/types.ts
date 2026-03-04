export type SpacingSettings = {
  paddingX: string;
  paddingY: string;
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
  name: string;
}

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
    spacing: SpacingSettings;
    colors: ColorSettings;
    sectionOrder: SectionOrderSettings;
    sectionVisibility?: Record<SectionType, boolean>;
    logo: LogoSettings;
    search: SearchSettings;
    actions: ActionsSettings;
  };
  content?: unknown;
};
