import type { CategoryTreeItem } from '@plentymarkets/shop-api';

export const CategoryTreeFixture: CategoryTreeItem[] = [
  {
    id: 73,
    type: 'item',
    childCount: 0,
    right: 'all',
    itemCount: [
      {
        categoryId: '73',
        webstoreId: '0',
        lang: 'en',
        count: '1',
        createdAt: '2024-01-01T00:00:00+02:00',
        updatedAt: '2024-01-01T00:00:00+02:00',
        variationCount: '1',
        customerClassId: '0',
      },
    ],
    details: [
      {
        lang: 'en',
        name: 'Gear',
        nameUrl: 'gear',
        metaTitle: '',
        imagePath: null,
        image2Path: null,
      },
    ],
  },
];
