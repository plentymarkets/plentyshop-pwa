import type { PropType } from 'vue';

export type ArrowLevel = string;

export interface ArrowSvgProps {
  level: ArrowLevel | null;
  size?: string;
  customClass?: string;
}

export const arrowSvgProps = {
  level: { type: String as PropType<ArrowLevel | null>, required: true },
  size: { type: String as PropType<'sm' | 'base' | 'lg' | 'xl' | 'xxl' | 'xxxl'>, default: 'base' },
  customClass: { type: String, default: '' }
};