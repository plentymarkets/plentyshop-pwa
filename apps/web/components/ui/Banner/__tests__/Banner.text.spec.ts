import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import { UiBanner } from '#components';

describe('Banner text', () => {
  it('should not render a pretitle if no pretitle is provided', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
          },
        },

        index: 0,
      },
    });

    expect(wrapper.find('[data-testid="banner-pretitle-0"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="banner-title-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-subtitle-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-description-0"]').exists()).toBe(true);
  });

  it('should not render a title if no title is provided', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            pretitle: 'Test pretitle',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
          },
        },

        index: 0,
      },
    });

    expect(wrapper.find('[data-testid="banner-pretitle-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-title-0"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="banner-subtitle-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-description-0"]').exists()).toBe(true);
  });

  it('should not render a subtitle if no subtitle is provided', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            htmlDescription: '<p>Test description</p>',
          },
        },

        index: 0,
      },
    });

    expect(wrapper.find('[data-testid="banner-pretitle-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-title-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-subtitle-0"]').exists()).toBe(false);
    expect(wrapper.find('[data-testid="banner-description-0"]').exists()).toBe(true);
  });

  it('should not render a description if no description is provided', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
          },
        },

        index: 0,
      },
    });

    expect(wrapper.find('[data-testid="banner-pretitle-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-title-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-subtitle-0"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="banner-description-0"]').exists()).toBe(false);
  });

  it('should set the given text color', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
            color: 'red',
          },
        },

        index: 0,
      },
    });

    const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

    expect(overlay.attributes('style')).toContain('color: red');
  });

  it('should set the given background color', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
            bgcolor: 'blue',
          },
        },

        index: 0,
      },
    });

    const content = wrapper.find('[data-testid="banner-content-0"]')

    expect(content.attributes('style')).toContain('background-color: blue');
  });

  it('should set the given background opacity', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
            bgopacity: 0.5,
          },
        },

        index: 0,
      },
    });

    const content = wrapper.find('[data-testid="banner-content-0"]')

    expect(content.attributes('style')).toContain('opacity: 0.5');
  });

  describe('text alignment', () => {
    it('should align text to the left by default', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('text-align: left');
    });

    it('should align text to the center', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              textAlignment: 'center',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('text-align: center');
    });

    it('should align text to the right', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              textAlignment: 'right',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('text-align: right');
    });
  });

  describe('justify content', () => {
    it('should justify content to the start by default', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('justify-content: flex-start');
    });

    it('should justify content to the center', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              justify: 'center',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('justify-content: center');
    });

    it('should justify content to the end', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              justify: 'end',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('justify-content: flex-end');
    });
  });

  describe('align items', () => {
    it('should align items to the start by default', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('align-items: flex-start');
    });

    it('should align items to the center', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              align: 'center',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('align-items: center');
    });

    it('should align items to the end', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
              align: 'end',
            },
          },

          index: 0,
        },
      });

      const overlay = wrapper.find('[data-testid="banner-overlay-0"]')

      expect(overlay.attributes('style')).toContain('align-items: flex-end');
    });
  });
});
