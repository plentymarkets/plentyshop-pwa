export type FooterProps = {
  simplifiedFooter?: boolean;
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