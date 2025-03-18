export type CarouselStructureProps = {
  name: string;
  type: string;
  content: Block[];
  configuration: {
    controls: {
      color: string;
      displayArrows: boolean;
    };
  };
  index: number;
  meta: {
    uuid: string;
  };
};
