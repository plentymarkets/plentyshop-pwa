import type { Block } from '@plentymarkets/shop-api';

export type DetailsListLayout = {
  fullWidth?: boolean;
};

export type DetailsListStructureConfiguration = {
  visible?: boolean;
  layout?: DetailsListLayout;
};

export type DetailsListItemSettings = {
  label?: string;
  defaultOpen?: boolean;
};

export type DetailsListItemConfiguration = {
  visible?: boolean;
  detailsSettings?: DetailsListItemSettings;
};

export type DetailsListProps = {
  name: string;
  type: string;
  meta: {
    uuid: string;
  };
  configuration?: DetailsListStructureConfiguration;
  content: Block[];
};

export type DetailsListFormProps = {
  uuid?: string;
};
