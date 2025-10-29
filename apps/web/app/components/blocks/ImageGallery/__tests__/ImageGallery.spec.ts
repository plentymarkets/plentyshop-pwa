import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ImageGallery from '../ImageGallery.vue';
import { mockImageGalleryBlock } from './ImageGallery.mock';
import { productGetters } from '@plentymarkets/shop-api';

vi.mock('@plentymarkets/shop-api', async () => {
  const actual = await vi.importActual<typeof import('@plentymarkets/shop-api')>('@plentymarkets/shop-api');
  return {
    ...actual,
    productGetters: {
      ...actual.productGetters,
      getGallery: vi.fn(() => [
        {
          url: 'image1.jpg',
          urlPreview: '',
          urlMiddle: '',
          urlSecondPreview: '',
        },
        {
          url: 'image2.jpg',
          urlPreview: '',
          urlMiddle: '',
          urlSecondPreview: '',
        },
      ]),
    },
    productImageGetters: {
      ...actual.productImageGetters,
      getImage: vi.fn((image) => ({
        url: image.url,
        alt: image.alt,
      })),
    },
  };
});

describe('ImageGallery', () => {
  it('should render the Gallery component', () => {
    const wrapper = mount(ImageGallery, {
      props: mockImageGalleryBlock,
    });

    const gallery = wrapper.findComponent({ name: 'Gallery' });
    expect(gallery.exists()).toBe(true);
  });

  it('should pass the correct configuration to the Gallery component', () => {
    const wrapper = mount(ImageGallery, {
      props: mockImageGalleryBlock,
    });

    const gallery = wrapper.findComponent({ name: 'Gallery' });
    expect(gallery.props('configuration')).toEqual(mockImageGalleryBlock.content);
  });

  it('should handle empty product gallery correctly', () => {
    vi.mocked(productGetters.getGallery).mockReturnValueOnce([]);

    const wrapper = mount(ImageGallery, {
      props: mockImageGalleryBlock,
    });

    const gallery = wrapper.findComponent({ name: 'Gallery' });
    expect(gallery.props('images')).toEqual([]);
  });

  it('should pass the correct images to the Gallery component', () => {
    const wrapper = mount(ImageGallery, {
      props: mockImageGalleryBlock,
    });

    const gallery = wrapper.findComponent({ name: 'Gallery' });

    expect(mockImageGalleryBlock.product).toBeDefined();

    const images = productGetters.getGallery(mockImageGalleryBlock.product!).map((image) => ({
      url: image.url,
      urlPreview: image.urlPreview || '',
      urlMiddle: image.urlMiddle || '',
      urlSecondPreview: image.urlSecondPreview || '',
    }));
    expect(gallery.props('images')).toEqual(images);
  });

  it.each(['left-vertical', 'right-vertical', 'bottom'] as const)(
    'should render the correct thumbnail type',
    (thumbnailType) => {
      const mockWithThumbnails = {
        ...mockImageGalleryBlock,
        content: {
          ...mockImageGalleryBlock.content,
          thumbnails: {
            showThumbnails: true,
            thumbnailType,
          },
        },
      };

      const wrapper = mount(ImageGallery, {
        props: mockWithThumbnails,
      });

      const gallery = wrapper.findComponent({ name: 'Gallery' });
      expect(gallery.props('configuration').thumbnails.thumbnailType).toBe(thumbnailType);
    },
  );

  it('should not render thumbnails if showThumbnails is false', () => {
    const mockWithoutThumbnails = {
      ...mockImageGalleryBlock,
      content: {
        ...mockImageGalleryBlock.content,
        thumbnails: {
          showThumbnails: false,
        },
      },
    };

    const wrapper = mount(ImageGallery, {
      props: mockWithoutThumbnails,
    });

    const gallery = wrapper.findComponent({ name: 'Gallery' });
    expect(gallery.props('configuration').thumbnails.showThumbnails).toBe(false);
  });
});
