export type CarouselContentItem = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration?: {
    visible?: boolean;
    [key: string]: unknown;
  };
  content?: unknown;
  [key: string]: unknown;
};

export type CarouselStructureProps = {
  name: string;
  type: string;
  content: CarouselContentItem[];
  configuration: {
    controls: {
      color: string;
      displayArrows?: boolean;
    };
    layout?: {
      fullWidth?: boolean;
    };
    visible?: boolean;
  };
  index: number;
  meta: {
    uuid: string;
  };
};
