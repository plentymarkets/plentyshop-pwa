export type TechnicalDataProps = {
  name?: string;
  type?: string;
  content: TechnicalDataContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type TechnicalDataContent = {
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

export type TechnicalDataFormProps = {
  uuid?: string;
};
