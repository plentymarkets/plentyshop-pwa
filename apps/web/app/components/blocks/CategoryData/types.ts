import type { Category } from '@plentymarkets/shop-api';
import type { BlockProps, FillMode, TextAlignment, VerticalAlignment, PaddingLayout } from '~/types/blocks';

export type CategoryDataFieldKey = 'name' | 'description1' | 'description2' | 'shortDescription';

export type CategoryDataFieldsVisibility = Record<CategoryDataFieldKey, boolean>;

/**
 * CategoryData block with runtime-injected properties.
 * Uses intersection pattern to extend BlockProps with category and shouldLoad runtime properties.
 */
export type CategoryDataProps = BlockProps<CategoryDataContent> & {
  shouldLoad?: boolean;
  category?: Category;
};

export type CategoryDataContent = {
  name: string;
  fields: CategoryDataFieldsVisibility;
  fieldsOrder: CategoryDataFieldKey[];
  fieldsDisabled: CategoryDataFieldKey[];
  layout: PaddingLayout & {
    narrowContainer: boolean;
  };
  displayCategoryImage: string;
  image: {
    alt?: string;
    brightness?: number;
    fillMode?: FillMode;
  };
  text: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    color?: string;
    bgColor?: string;
    bgOpacity?: number;
    textAlignment?: TextAlignment;
    justify?: VerticalAlignment;
    align?: TextAlignment;
    background?: boolean;
  };
};
export interface CategoryData {
  name: string;
  description1: string;
  description2: string;
  shortDescription: string;
}
