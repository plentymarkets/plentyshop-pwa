export type ItemTextProps = {
  name?: string;
  type?: string;
  content: ItemTextContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type ItemTextContent = {
  text: {
    title: string;
  };
  layout: {
    displayAsCollapsable: boolean;
    initiallyCollapsed: boolean;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
};

export type ItemTextFormProps = {
  uuid?: string;
};
