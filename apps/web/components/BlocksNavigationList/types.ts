export type BlocksList = {
  [key: string]: {
    category: string;
    title: string;
    blockName: string;
    variations: {
      title: string;
      image: string;
      template: {
        en: Block;
        de: Block;
      };
    }[];
  };
};
