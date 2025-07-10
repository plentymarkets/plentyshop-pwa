export interface FooterColumn {
  title?: string;
  description?: string;
  showContactLink?: boolean;
  showLinkToContact?: boolean;
  text?: {
    title?: string;
    description?: string;
    showContactLink?: boolean;
    [key: string]: unknown;
  };
}
