import type { PriceCardContent } from '~/components/ui/PurchaseCard/types';

export interface LocalizedString {
  de?: string | null;
  en?: string | null;
}

export interface ApiProperty {
  id: number;
  names: LocalizedString;
  descriptions: LocalizedString;
  cast: string;
}

export interface ApiGroup {
  id: number;
  position: number;
  names: LocalizedString;
  descriptions: LocalizedString;
  properties: ApiProperty[];
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
