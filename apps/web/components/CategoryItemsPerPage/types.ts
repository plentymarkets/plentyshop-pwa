import { SortFilterContent } from '~/components/blocks/SortFilter/types';

export type CategoryItemsPerPageProps = {
  totalProducts: number;
  configuration?: SortFilterContent;
};
export type Option = {
  label: string;
  value: string;
  disabled: boolean;
};
