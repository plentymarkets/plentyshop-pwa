export type HomeIntroContent = {
  title?: string;
  lead?: string;
  about?: string;
};

export type HomeIntroProps = {
  name: string;
  type: string;
  content: HomeIntroContent;
  meta: {
    uuid: string;
  };
  index?: number;
};
