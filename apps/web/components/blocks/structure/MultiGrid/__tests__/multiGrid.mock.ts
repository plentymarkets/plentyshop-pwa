export const multiGridBlockUuid = '22222222-2222-4222-8222-222222222222';

export const mockMultiGridProps = {
  name: 'MainGrid',
  type: 'multi-grid',
  content: [
    {
      name: 'TextCard',
      type: 'text',
          content: {
        text: {
          htmlDescription: 'Text that supports HTML formatting',
          title: 'h2 heading',
          subtitle: 'subtitle',
          textAlignment: 'left',
          color: '#000',
        },
        button: {
          label: 'Button',
          link: '/',
          variant: 'primary',
        },
        layout: {
          backgroundColor: '#ffffff',
          paddingTop: '0',
          paddingBottom: '0',
          paddingLeft: '0',
          paddingRight: '0',
          keepTransparent: 'true',
        },
      },
      meta: { uuid: '33333333-3333-4333-8333-333333333333' },
      parent_slot: 0,
    },
    {
      name: 'Image',
      type: 'image',
           content: {
        image: {
          wideScreen: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
          desktop: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
          tablet: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
          mobile: 'https://cdn02.plentymarkets.com/v5vzmmmcb10k/frontend/PWA/placeholder-image.png',
          alt: 'alt text',
          imageAlignment: 'right',
          fillMode: 'fill',
          aspectRatio: '16 / 9',
        },
        text: {
          textOverlay: '',
          textOverlayColor: '#333333',
          textOverlayAlignY: 'center',
          textOverlayAlignX: 'center',
        },
        button: {
          label: '',
          link: '',
          variant: 'primary',
        },
      },
      meta: { uuid: '44444444-4444-4444-8444-444444444444' },
      parent_slot: 1,
    },
  ],
  configuration: {
    columnWidths: [6, 6],
  },
  layout: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
    gap: 'M',
  },
  meta: {
    uuid: multiGridBlockUuid,
  },
};

