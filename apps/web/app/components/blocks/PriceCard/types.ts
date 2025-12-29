import type { PriceCardContent } from '~/components/ui/PurchaseCard/types';

export type PriceCardProps = {
  name: string;
  type: string;
  content: PriceCardContent;
  configuration?: object;
  index?: number;
  meta: {
    uuid: string;
  };
};

export interface PriceCardFormProps {
  uuid?: string;
}
