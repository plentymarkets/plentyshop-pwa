export type CustomerReviewProps = {
  name: string;
  type: string;
  configuration?: object;
  content: CustomerReviewContent;
  index?: number;
  meta: {
    uuid: string;
  };
};

export type CustomerReviewContent = {
  text: {
    title: string;
  };
  layout: {
    collapsible: boolean;
    initiallyCollapsed: boolean;
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
  };
};
