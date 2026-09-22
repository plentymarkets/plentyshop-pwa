const blocksList = {
  'item-category': {
    category: 'item-category',
    accessControl: ['productCategory'],
    title: 'Item Category',
    blockName: 'ItemGrid',
    variations: [
      {
        title: 'Category Filter Per Page',
        template: {
          en: {
            name: 'PerPageFilter',
            type: 'content',
            meta: {
              uuid: '265438f3-48fe-428f-a87b-d9d29dbeb748',
              isGlobalTemplate: false,
            },
            content: {
              fields: {
                perPage: true,
              },
              layout: {
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                fullWidth: false,
              },
              settings: {
                selectionModeCompact: false,
              },
            },
          },
          de: {
            name: 'PerPageFilter',
            type: 'content',
            meta: {
              uuid: '265438f3-48fe-428f-a87b-d9d29dbeb748',
              isGlobalTemplate: false,
            },
            content: {
              fields: {
                perPage: true,
              },
              layout: {
                paddingTop: 0,
                paddingBottom: 0,
                paddingLeft: 0,
                paddingRight: 0,
                fullWidth: false,
              },
              settings: {
                selectionModeCompact: false,
              },
            },
          },
        },
      },
    ],
  },
};

export const getBlocksList = (): BlocksList => blocksList as unknown as BlocksList;
