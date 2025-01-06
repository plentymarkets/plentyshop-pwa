import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils'
import { UiBanner } from '#components';

describe('Banner', () => {
  describe('with default settings', () => {
    const wrapper = mount(UiBanner, {
      props: {
        bannerProps: {
          image: {
            lg: '/test-lg.jpg',
            md: '/test-md.jpg',
            sm: '/test-sm.jpg',
            xs: '/test-xs.jpg',
            alt: 'test alt text',
          },
          text: {
            pretitle: 'Test pretitle',
            title: 'Test title',
            subtitle: 'Test subtitle',
            htmlDescription: '<p>Test description</p>',
          },
          button: {
            label: 'Test button',
            link: '/test-link',
          },
        },

        index: 0,
      },
    });

    it('should render', () => {
      expect(wrapper.html()).not.toBe(null);
    });

    it('should have an image', () => {
      const image = wrapper.find('[data-testid="banner-image-0"]');

      expect(image.exists()).toBe(true);
      expect(image.attributes('src')).toBe('/test-lg.jpg');
      expect(image.attributes('alt')).toBe('test alt text');
    });

    it('should have a content overlay', () => {
      const overlay = wrapper.find('[data-testid="banner-overlay-0"]');

      expect(overlay.exists()).toBe(true);
      expect(overlay.attributes('style')).toContain('text-align: left');
      expect(overlay.attributes('style')).toContain('justify-content: flex-start');
      expect(overlay.attributes('style')).toContain('align-items: flex-start');
    });

    it('should have a content area', () => {
      const content = wrapper.find('[data-testid="banner-content-0"]');

      expect(content.exists()).toBe(true);
    });

    it('should have a pretitle', () => {
      const pretitle = wrapper.find('[data-testid="banner-pretitle-0"]');

      expect(pretitle.exists()).toBe(true);
      expect(pretitle.text()).toBe('Test pretitle');
    });

    it('should have a title', () => {
      const title = wrapper.find('[data-testid="banner-title-0"]');

      expect(title.exists()).toBe(true);
      expect(title.text()).toBe('Test title');
    });

    it('should have a subtitle', () => {
      const subtitle = wrapper.find('[data-testid="banner-subtitle-0"]');

      expect(subtitle.exists()).toBe(true);
      expect(subtitle.text()).toBe('Test subtitle');
    });

    it('should have a description', () => {
      const description = wrapper.find('[data-testid="banner-description-0"]');

      expect(description.exists()).toBe(true);
      expect(description.text()).toBe('Test description');
      expect(description.html()).toContain('<p>Test description</p>');
    });

    it('should have a button', () => {
      const button = wrapper.find('[data-testid="banner-button-0"]');

      expect(button.exists()).toBe(true);
      expect(button.attributes('to')).toBe('/test-link');
      expect(button.attributes('class')).toContain('bg-primary-500');
    });
  });

  describe('image settings', () => {
    it('should not render an image if no image is provided', () => {
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

      const image = wrapper.find('[data-testid="banner-image-0"]');

      console.log(image.html());

      expect(image.attributes('src')).toBe('');
      expect(image.attributes('alt')).toBe('');
      expect(image.attributes('style')).toBe(undefined);

      expect(wrapper.find('[data-testid="banner-overlay-0"]').exists()).toBe(true);
    });

    it('should set the given brightness', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            image: {
              lg: '/test-lg.jpg',
              md: '/test-md.jpg',
              sm: '/test-sm.jpg',
              xs: '/test-xs.jpg',
              alt: 'test alt text',
              brightness: 0.5,
            },
          },

          index: 0,
        },
      });

      const image = wrapper.find('[data-testid="banner-image-0"]');

      expect(image.attributes('style')).toContain('filter: brightness(0.5)');
    });
  });

  describe('text settings', () => {
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

  describe('button settings', () => {
    it('should not render a button if no button is provided', () => {
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

      expect(wrapper.find('[data-testid="banner-button-0"]').exists()).toBe(false);
    });

    it('should not render a button if no label is provided', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
            },
            button: {
              link: '/test-link',
            },
          },

          index: 0,
        },
      });

      expect(wrapper.find('[data-testid="banner-button-0"]').exists()).toBe(false);
    });

    it('should not render a button if no link is provided', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
            },
            button: {
              label: 'Test button',
            },
          },

          index: 0,
        },
      });

      expect(wrapper.find('[data-testid="banner-button-0"]').exists()).toBe(false);
    });

    it('should set the given button variant', () => {
      const wrapper = mount(UiBanner, {
        props: {
          bannerProps: {
            text: {
              pretitle: 'Test pretitle',
              title: 'Test title',
              subtitle: 'Test subtitle',
              htmlDescription: '<p>Test description</p>',
            },
            button: {
              label: 'Test button',
              link: '/test-link',
              variant: 'secondary',
            },
          },

          index: 0,
        },
      });

      const button = wrapper.find('[data-testid="banner-button-0"]');

      expect(button.attributes('class')).toContain('text-primary-500');
    });
  });
});
