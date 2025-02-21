export type BlocksList = {
  [key: string]: {
    category: string;
    title: string;
    blockName: string;
    variations: {
      title: string;
      image: string;
      template: {
        en: {
          name: string;
          type: string;
          content: Record<string, unknown>;
        };
        de: {
          name: string;
          type: string;
          content: Record<string, unknown>;
        };
      };
    }[];
  };
};
