export type TechnicalDataProps = {
  name?: string;
  type?: string;
  content?: TechnicalDataContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type TechnicalDataContent = {
  title: string;
  displayAsCollapsable: boolean;
  initiallyCollapsed: boolean;
  layout: {
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
  };
};

export type TechnicalDataFormProps = {
  uuid?: string;
};
