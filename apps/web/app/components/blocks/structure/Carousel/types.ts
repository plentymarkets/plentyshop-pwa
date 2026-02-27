import type { BannerProps } from '~/components/blocks/Banner/types';

export type CarouselStructureProps = {
  name: string;
  type: string;
  content: BannerProps[];
  configuration: {
    controls: {
      color: string;
      displayArrows: boolean;
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
