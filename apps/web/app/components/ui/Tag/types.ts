import { TagVariant, TagSize } from './enums';
export { TagVariant, TagSize };

export interface TagProps {
  size?: `${TagSize}`;
  strong?: boolean;
  variant?: `${TagVariant}`;
}
