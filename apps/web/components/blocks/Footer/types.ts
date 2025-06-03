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

export interface FooterContent {
  firstColumn: FooterColumn;
  secondColumn: FooterColumn;
  thirdColumn: FooterColumn;
  fourthColumn: FooterColumn;
  color: FooterColor;
  footnotes: FooterFootnotes;
}

export interface FooterMeta {
  uuid: string;
}

export interface FooterBlock {
  name: string;
  type: string;
  meta: FooterMeta;
  content: FooterContent;
}

export interface FooterSettingsColumn {
  title: string;
  description?: string;
  showContactLink?: boolean;
}

export interface FooterSettingsColors {
  background: string;
  text: string;
  noteBackground: string;
  noteText: string;
}

export interface FooterSettings {

  meta: {
    uuid: string;
  };
  column1: FooterSettingsColumn;
  column2: FooterSettingsColumn;
  column3: FooterSettingsColumn;
  column4: FooterSettingsColumn;
  footnote: string;
  footnoteAlign: 'left' | 'center' | 'right';
  colors: FooterSettingsColors;
}