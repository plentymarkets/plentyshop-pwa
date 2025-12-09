import type { BlockProps, ButtonSection, TextSection, PaddingLayout } from '~/types/blocks';

export type TextCardProps = BlockProps<TextCardContent>;

export type TextCardContent = {
  text: TextSection;
  button: ButtonSection;
  layout: Partial<PaddingLayout> & {
    backgroundColor?: string;
  };
};

export type TextCardFormProps = {
  uuid?: string;
};
