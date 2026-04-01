import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { BlocksBanner } from '#components';

const bannerBlockUuid = '11111111-1111-4111-8111-111111111111';

describe('Banner text', () => {
  it('should not render a description if no description is provided', () => {
    const wrapper = mount(BlocksBanner, {
      props: {
        name: 'Banner',
        type: 'content',
        content: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
          },
          image: {},
          button: {},
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    expect(wrapper.find(`[data-testid="text-html"]`).exists()).toBe(false);
  });

  it('should set the given text color', () => {
    const wrapper = mount(BlocksBanner, {
      props: {
        name: 'Banner',
        type: 'content',
        content: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
            color: 'red',
          },
          image: {},
          button: {},
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    const overlay = wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`);
    expect(overlay.attributes('style')).toContain('color: red');
  });

  it('should set the given background color', () => {
    const wrapper = mount(BlocksBanner, {
      props: {
        name: 'Banner',
        type: 'content',
        content: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
            bgcolor: '#0000FF',
            background: true,
          },
          image: {},
          button: {},
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    const content = wrapper.find(`[data-testid="banner-content-${bannerBlockUuid}"]`);
    expect(content.attributes('style')).toContain('background-color: rgba(0, 0, 255, 1)');
  });

  it('should set the given background opacity', () => {
    const wrapper = mount(BlocksBanner, {
      props: {
        name: 'Banner',
        type: 'content',
        content: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
            bgopacity: 0.5,
            background: true,
          },
          image: {},
          button: {},
        },
        index: 0,
        lazyLoading: 'eager',
        meta: {
          uuid: bannerBlockUuid,
        },
      },
    });

    const content = wrapper.find(`[data-testid="banner-content-${bannerBlockUuid}"]`);
    expect(content.attributes('style')).toContain('background-color: rgba(255, 255, 255, 0.5)');
  });

  describe('text alignment', () => {
    it('should align text to the left by default', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p style="text-align: left;">Example left description</p>',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="text-html"]`);
      expect(overlay.html()).toContain('text-align: left');
    });

    it('should align text to the center', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p style="text-align: center;">Example center description</p>',
              textAlignment: 'center',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="text-html"]`);
      expect(overlay.html()).toContain('text-align: center');
    });

    it('should align text to the right', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p style="text-align: right;">Example right description</p>',
              textAlignment: 'right',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="text-html"]`);
      expect(overlay.html()).toContain('text-align: right');
    });
  });

  describe('justify content', () => {
    it('should justify content to the start by default', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`);
      expect(overlay.attributes('style')).toContain('justify-content: flex-start');
    });

    it('should justify content to the center', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              justify: 'center',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`);
      expect(overlay.attributes('style')).toContain('justify-content: center');
    });

    it('should justify content to the end', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              justify: 'bottom',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`);
      expect(overlay.attributes('style')).toContain('justify-content: flex-end');
    });
  });

  describe('align items', () => {
    it('should align items to the start by default', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`);
      expect(overlay.attributes('style')).toContain('align-items: flex-start');
    });

    it('should align items to the center', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              align: 'center',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`);
      expect(overlay.attributes('style')).toContain('align-items: center');
    });

    it('should align items to the end', () => {
      const wrapper = mount(BlocksBanner, {
        props: {
          name: 'Banner',
          type: 'content',
          content: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              align: 'right',
            },
            image: {},
            button: {},
          },
          index: 0,
          lazyLoading: 'eager',
          meta: {
            uuid: bannerBlockUuid,
          },
        },
      });

      const overlay = wrapper.find(`[data-testid="banner-overlay-${bannerBlockUuid}"]`);
      expect(overlay.attributes('style')).toContain('align-items: flex-end');
    });
  });
});
