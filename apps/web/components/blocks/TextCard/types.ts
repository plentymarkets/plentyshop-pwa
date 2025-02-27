export type TextCardProps = {
  name: string;
  type: string;
  content: TextCardContent;
  configuration?: {
    controls: {
      color: string;
      displayArrows: boolean;
    };
  };
  index?: number;
};

export type TextCardContent = {
  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    textAlignment?: 'left' | 'center' | 'right';
    color?: string;
  };
  button: {
    label?: string;
    link?: string;
    variant?: 'primary' | 'secondary';
  };
};
