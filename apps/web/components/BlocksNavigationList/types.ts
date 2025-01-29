export type BlocksList = {
  [key: string]: {
    category: string;
    title: string;
    variations: {
      title: string;
      image: string;
      template: {
        en: {
          name: string;
          options: Record<string, unknown>;
        };
        de: {
          name: string;
          options: Record<string, unknown>;
        };
      };
    }[];
  };
};
