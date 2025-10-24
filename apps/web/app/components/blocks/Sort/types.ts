export type SortFieldKey = 'sortBy';


export type SortFieldsVisibility = Record<SortFieldKey, boolean>;


export type SortContent = {
  fields: SortFieldsVisibility;
};


export type SortProps = {
  content?: SortContent;
};


export type SortFormProps = {
  uuid?: string;
};
