import type { ComputedRef } from 'vue';
import { useEditorOptionsTabs } from './useEditorOptionsTabs';
import type { Option } from '~/components/editor/OptionsTabs/types';

export type TextAlignX = 'left' | 'center' | 'right';
export type TextAlignY = 'top' | 'center' | 'bottom';
export type ButtonVariant = 'primary' | 'secondary';
export type DisplayCategoryImage = 'off' | 'image-1' | 'image-2';
export type FillMode = 'fill' | 'fit';


export type TextOverlayTarget = {
  text: {
    align?: TextAlignX;
    justify?: TextAlignY;
    textAlignment?: TextAlignX;
  };
  button: {
    variant?: ButtonVariant;
  };
};

const ALIGN_X_ITEMS = [
  { value: 'left', labelKey: 'textbox-align-x-left-label' },
  { value: 'center', labelKey: 'textbox-align-x-center-label' },
  { value: 'right', labelKey: 'textbox-align-x-right-label' },
] as const;

const ALIGN_Y_ITEMS = [
  { value: 'top', labelKey: 'textbox-align-y-top-label' },
  { value: 'center', labelKey: 'textbox-align-y-center-label' },
  { value: 'bottom', labelKey: 'textbox-align-y-bottom-label' },
] as const;

const TEXT_ALIGN_ITEMS = [
  { value: 'left', labelKey: 'text-align-option-left-label' },
  { value: 'center', labelKey: 'text-align-option-center-label' },
  { value: 'right', labelKey: 'text-align-option-right-label' },
] as const;

const BUTTON_VARIANT_ITEMS = [
  { value: 'primary', labelKey: 'button-variant-primary-label', testIdSuffix: 'primary' },
  { value: 'secondary', labelKey: 'button-variant-secondary-label', testIdSuffix: 'secondary' },
] as const;

export function useTextOverlayTabs(args: {
  t: (key: string) => string;
  getTarget: () => TextOverlayTarget;
}): {
  textboxAlignXModel: ComputedRef<TextAlignX>;
  textboxAlignYModel: ComputedRef<TextAlignY>;
  textAlignModel: ComputedRef<TextAlignX>;
  buttonVariantModel: ComputedRef<ButtonVariant>;
  textboxAlignXOptions: ComputedRef<Option<TextAlignX>[]>;
  textboxAlignYOptions: ComputedRef<Option<TextAlignY>[]>;
  textAlignOptions: ComputedRef<Option<TextAlignX>[]>;
  buttonVariantOptions: ComputedRef<Option<ButtonVariant>[]>;
} {
  const { model: textboxAlignXModel, options: textboxAlignXOptions } = useEditorOptionsTabs<TextAlignX>({
    t: args.t,
    testIdPrefix: 'slider-textbox-align-x',
    get: () => args.getTarget().text.align,
    set: (v) => (args.getTarget().text.align = v),
    defaultValue: 'left',
    items: ALIGN_X_ITEMS,
  });

  const { model: textboxAlignYModel, options: textboxAlignYOptions } = useEditorOptionsTabs<TextAlignY>({
    t: args.t,
    testIdPrefix: 'slider-textbox-align-y',
    get: () => args.getTarget().text.justify,
    set: (v) => (args.getTarget().text.justify = v),
    defaultValue: 'top',
    items: ALIGN_Y_ITEMS,
  });

  const { model: textAlignModel, options: textAlignOptions } = useEditorOptionsTabs<TextAlignX>({
    t: args.t,
    testIdPrefix: 'slider-text-align',
    get: () => args.getTarget().text.textAlignment,
    set: (v) => (args.getTarget().text.textAlignment = v),
    defaultValue: 'left',
    items: TEXT_ALIGN_ITEMS,
  });

  const { model: buttonVariantModel, options: buttonVariantOptions } = useEditorOptionsTabs<ButtonVariant>({
    t: args.t,
    testIdPrefix: 'slider-button-variant',
    get: () => args.getTarget().button.variant,
    set: (v) => (args.getTarget().button.variant = v),
    defaultValue: 'primary',
    items: BUTTON_VARIANT_ITEMS,
  });

  return {
    textboxAlignXModel,
    textboxAlignXOptions,
    textboxAlignYModel,
    textboxAlignYOptions,
    textAlignModel,
    textAlignOptions,
    buttonVariantModel,
    buttonVariantOptions,
  };
}
