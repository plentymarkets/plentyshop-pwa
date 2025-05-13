export type TextContentProps = {
  index?: number;
  text?: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    color?: string;
    textAlignment?: 'left' | 'center' | 'right';
  };
  button?: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
};
