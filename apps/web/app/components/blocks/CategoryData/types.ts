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
    narrowContainer: boolean;
  };
  displayCategoryImage: string;
  image: {
    wideScreen?: string;
    desktop?: string;
    tablet?: string;
    mobile?: string;
    alt?: string;
    brightness?: number;
    fillMode?: 'fill' | 'fit';
  };
  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    color?: string;
    bgColor?: string;
    bgOpacity?: number;
    textAlignment?: 'left' | 'center' | 'right';
    justify?: 'top' | 'center' | 'bottom';
    align?: 'left' | 'center' | 'right';
    background?: boolean;
  };
};
export interface CategoryData {
  name: string;
  description1: string;
  description2: string;
  shortDescription: string;
}
