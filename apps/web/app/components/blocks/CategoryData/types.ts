import type { Category } from '@plentymarkets/shop-api';
export type CategoryDataFieldKey = 'name' | 'description1' | 'description2' | 'shortDescription';

export type CategoryDataFieldsVisibility = Record<CategoryDataFieldKey, boolean>;

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
  category?: Category;
};

export type CategoryDataContent = {
  name: string;
  fields: CategoryDataFieldsVisibility;
  fieldsOrder: CategoryDataFieldKey[];
  fieldsDisabled: CategoryDataFieldKey[];
  layout: {
    paddingTop: number;
    paddingBottom: number;
    paddingLeft: number;
    paddingRight: number;
  };
};
