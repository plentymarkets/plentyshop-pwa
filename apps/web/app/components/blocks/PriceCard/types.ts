import type { PriceCardContent } from '~/components/ui/PurchaseCard/types';

export interface ItemPropertyTranslated {
  id: number;
  cast: string;
  name: string;
  description: string;
}

export interface ApiGroup {
  id: number;
  position: number;
  name: string;
  description: string;
  properties: ItemPropertyTranslated[];
}

export interface PropSelection {
  name: boolean;
  value: boolean;
}

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
