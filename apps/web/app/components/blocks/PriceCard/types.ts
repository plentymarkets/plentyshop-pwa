import type { ItemPropertyGroupTranslated, ItemPropertyTranslated } from '@plentymarkets/shop-api';
import type { PriceCardContent } from '~/components/ui/PurchaseCard/types';

export type { ItemPropertyGroupTranslated, ItemPropertyTranslated };

export type ApiGroup = ItemPropertyGroupTranslated;

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

export type WishlistSize = 'small' | 'large';
