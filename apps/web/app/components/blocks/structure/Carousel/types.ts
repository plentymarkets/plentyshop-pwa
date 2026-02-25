import type { Block } from '@plentymarkets/shop-api';
export type CarouselStructureProps = {
  name: string;
  type: string;
  content: (Block & { configuration: { visible: boolean } })[];
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
