export type FooterProps = {
  content?: FooterSettings;
};

export interface FooterColumnText {
  title: string;
  showLinkToContact?: boolean;
  htmlDescription?: string;
}

export interface FooterColumn {
  text: FooterColumnText;
}

export interface FooterColor {
  text: string;
  background: string;
}

export interface FooterFootnotes {
  text: string;
  color: FooterColor;
}

export interface FooterSettingsColumn {
  title: string;
  description?: string;
  showContactLink?: boolean;
}

export interface FooterSettingsColors {
  background: string;
  text: string;
  footnoteBackground: string;
  footnoteText: string;
}

export interface FooterSettings {
  meta: {
    uuid: string;
    isGlobalTemplate?: boolean;
  };
  column1: FooterSettingsColumn;
  column2: FooterSettingsColumn;
  column3: FooterSettingsColumn;
  column4: FooterSettingsColumn;
  footnote: string;
  footnoteAlign: 'left' | 'center' | 'right';
  colors: FooterSettingsColors;
}
