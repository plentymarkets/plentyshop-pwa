export interface BlockTextFieldsGroupProps {
  model: {
    pretitle?: string;
    title?: string;
    subtitle?: string;
    htmlDescription?: string;
    color?: string;
    textAlignment?: 'left' | 'center' | 'right';
  };
  pretitleLabel?: string;
  pretitlePlaceholder?: string;
  pretitleTestid?: string;
  titleLabel?: string;
  titlePlaceholder?: string;
  titleTestid?: string;
  subtitleLabel?: string;
  subtitlePlaceholder?: string;
  subtitleTestid?: string;
  descriptionLabel?: string;
  descriptionPlaceholder?: string;
  descriptionTestid?: string;
  colorLabel?: string;
  colorTestid?: string;
  textAlignLabel?: string;
  textAlignLeftLabel?: string;
  textAlignCenterLabel?: string;
  textAlignRightLabel?: string;
}
