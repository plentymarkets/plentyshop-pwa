export type Icon = string | string[] | { paths: string | string[]; viewBox: string };

export type UserIconCategory = 'social' | 'utility';

export interface UserIcon {
  label: string;
  category: UserIconCategory;
  viewBox: string;
  paths: string[];
}
