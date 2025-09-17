export type CategoryDataProps = {
  name: string;
  type: string;
  content: CategoryDataContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
  shouldLoad?: boolean;
};

export type CategoryDataContent = {
  categoryId: string;
  name: string;
  description1?: string;
  description2?: string;
};

