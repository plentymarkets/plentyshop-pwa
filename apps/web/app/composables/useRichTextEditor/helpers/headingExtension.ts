import { Extension } from '@tiptap/core';
import { RTE_FOOTER_HEADING_VARIANT, RTE_HEADING_VARIANT_ATTRIBUTE } from '../constants';

export const HeadingVariant = Extension.create({
  name: 'headingVariant',
  addGlobalAttributes() {
    return [
      {
        types: ['heading'],
        attributes: {
          variant: {
            default: null,
            parseHTML: (element) =>
              element.tagName === 'H2' &&
              element.getAttribute(RTE_HEADING_VARIANT_ATTRIBUTE) === RTE_FOOTER_HEADING_VARIANT
                ? RTE_FOOTER_HEADING_VARIANT
                : null,
            renderHTML: (attributes) =>
              attributes.level === 2 && attributes.variant === RTE_FOOTER_HEADING_VARIANT
                ? { [RTE_HEADING_VARIANT_ATTRIBUTE]: RTE_FOOTER_HEADING_VARIANT }
                : {},
          },
        },
      },
    ];
  },
});
