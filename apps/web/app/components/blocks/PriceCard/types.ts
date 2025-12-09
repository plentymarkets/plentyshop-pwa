import type { PriceCardContent } from '~/components/ui/PurchaseCard/types';
import type { BlockProps } from '~/types/blocks';

export type PriceCardProps = BlockProps<PriceCardContent>;

export interface PriceCardFormProps {
  uuid?: string;
}
