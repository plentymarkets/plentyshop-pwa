import type { PaddingLayout } from '~/types/blocks';

export type ItemDataFieldKey =
  | 'itemId'
  | 'condition'
  | 'ageRating'
  | 'externalVariationId'
  | 'model'
  | 'manufacturer'
  | 'manufacturingCountry'
  | 'content'
  | 'grossWeight'
  | 'netWeight'
  | 'dimensions'
  | 'customTariffNumber'
  | 'properties';

export type ItemDataFieldsVisibility = Partial<Record<ItemDataFieldKey, boolean>>;

export type ItemDataFieldsOrder = ItemDataFieldKey[];

export interface ItemDataLayout extends PaddingLayout {
  displayAsCollapsable?: boolean;
  initiallyCollapsed?: boolean;
}

export interface ItemDataText {
  title: string;
}

export interface ItemDataContent {
  text: ItemDataText;
  fields: ItemDataFieldsVisibility;
  fieldsOrder: ItemDataFieldsOrder;
  layout: ItemDataLayout;
}

export type ItemDataFieldLabels = Record<ItemDataFieldKey, string>;
export type ItemDataFieldValues = Record<ItemDataFieldKey, string>;
