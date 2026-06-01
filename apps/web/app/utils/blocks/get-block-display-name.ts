const blockTypeNames: Record<string, string> = {
  Carousel: 'Carousel',
  NewsletterSubscribe: 'Newsletter',
  ProductRecommendedProducts: 'Product Gallery',
  TextCard: 'Rich Text',
  AnnouncementBar: 'Announcement Bar',
  CustomerReview: 'Customer reviews',
  ProductLegalInformation: 'Legal Information',
  MultiGrid: 'Layout',
  Footer: 'Footer',
  ItemText: 'Item Details',
  CategoryData: 'Category Data',
  TechnicalData: 'Technical Data',
  ItemData: 'Item Data',
  Banner: 'Image Banner',
  UtilityBar: 'Utility Bar',
  HeaderContainer: 'Header Container',
  FooterContainer: 'Footer Container',
};

type ModuleBlockTypeNamesExport = {
  blockTypeNames?: Record<string, string>;
  default?: Record<string, string>;
};

const moduleBlockTypeNamesFiles = import.meta.glob<ModuleBlockTypeNamesExport>(
  '~~/modules/*/runtime/utils/blocks/block-type-names.ts',
  { eager: true },
);

const moduleBlockTypeNames = Object.entries(moduleBlockTypeNamesFiles)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .reduce<Record<string, string>>((acc, [, file]) => {
    const maps = [file.blockTypeNames, file.default].filter(Boolean) as Record<string, string>[];

    for (const names of maps) {
      for (const [key, value] of Object.entries(names)) {
        if (!(key in acc)) {
          acc[key] = value;
        }
      }
    }

    return acc;
  }, {});

export const getBlockDisplayName = (blockName: string): string => {
  return moduleBlockTypeNames[blockName] ?? blockTypeNames[blockName] ?? blockName;
};
