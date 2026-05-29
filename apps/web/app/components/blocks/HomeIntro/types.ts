export type HomeIntroContent = {
  title?: string;
  subtitle?: string;
  lead?: string;
  aboutHeading?: string;
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

