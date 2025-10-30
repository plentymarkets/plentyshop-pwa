export type ProductLegalInformationProps = {
  name: string;
  type: string;
  configuration?: object;
  content: ProductLegalInformationContent;
  index?: number;
  meta: {
    uuid: string;
  };
};


export type ProductLegalInformationContent = {
  text: {
    title: string;
    linkText: string;
  };
  layout: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
  };
};