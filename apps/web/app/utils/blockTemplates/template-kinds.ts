export const HOMEPAGE_TEMPLATE_KIND = 'homepage' as const;
export const CATEGORY_TEMPLATE_KIND = 'category' as const;
export const PRODUCT_TEMPLATE_KIND = 'product' as const;
export const HEADER_TEMPLATE_KIND = 'header' as const;
export const FOOTER_TEMPLATE_KIND = 'footer' as const;

export const BLOCK_TEMPLATE_KINDS = [
  HOMEPAGE_TEMPLATE_KIND,
  CATEGORY_TEMPLATE_KIND,
  PRODUCT_TEMPLATE_KIND,
  HEADER_TEMPLATE_KIND,
  FOOTER_TEMPLATE_KIND,
] as const;
