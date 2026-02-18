import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AnnouncementBar from '../AnnouncementBar.vue';
import { mockAnnouncementBar } from './AnnouncementBar.mock';

vi.mock('swiper/vue', () => ({
  Swiper: {
    name: 'Swiper',
    template: '<div data-testid="swiper"><slot /></div>',
    props: ['slidesPerView', 'loop', 'modules', 'navigation'],
    emits: ['swiper'],
    setup(_: unknown, { emit }: { emit: (event: string, ...args: unknown[]) => void }) {
      emit('swiper', { navigation: { init: vi.fn(), update: vi.fn() }, destroyed: false });
    },
  },
  SwiperSlide: {
    name: 'SwiperSlide',
    template: '<div data-testid="swiper-slide"><slot /></div>',
  },
}));

vi.mock('swiper/modules', () => ({
  Navigation: {},
}));

vi.mock('@storefront-ui/vue', () => ({
  SfIconChevronLeft: { name: 'SfIconChevronLeft', template: '<span />' },
  SfIconChevronRight: { name: 'SfIconChevronRight', template: '<span />' },
}));

describe('AnnouncementBar - Visible Items', () => {
  it('should only render visible items', () => {
    const wrapper = mount(AnnouncementBar, { props: mockAnnouncementBar });
    const slides = wrapper.findAll('[data-testid="swiper-slide"]');

    expect(slides).toHaveLength(2);
  });

  it('should render all items when all are visible', () => {
    const allVisible = {
      ...mockAnnouncementBar,
      content: mockAnnouncementBar.content.map((item) => ({
        ...item,
        content: { ...item.content, visible: true },
      })),
    };

    const wrapper = mount(AnnouncementBar, { props: allVisible });
    const slides = wrapper.findAll('[data-testid="swiper-slide"]');

    expect(slides).toHaveLength(3);
  });

  it('should render no slides when all items are hidden', () => {
    const allHidden = {
      ...mockAnnouncementBar,
      content: mockAnnouncementBar.content.map((item) => ({
        ...item,
        content: { ...item.content, visible: false },
      })),
    };

    const wrapper = mount(AnnouncementBar, { props: allHidden });
    const slides = wrapper.findAll('[data-testid="swiper-slide"]');

    expect(slides).toHaveLength(0);
  });

  it('should render item text via v-html', () => {
    const wrapper = mount(AnnouncementBar, { props: mockAnnouncementBar });
    const firstSlide = wrapper.findAll('[data-testid="swiper-slide"]')[0]!;

    expect(firstSlide.html()).toContain('Free shipping on orders over $50');
  });
});

describe('AnnouncementBar - Navigation', () => {
  it('should render navigation buttons when more than one item is visible', () => {
    const wrapper = mount(AnnouncementBar, { props: mockAnnouncementBar });

    expect(wrapper.find('.swiper-button-prev-announcement').exists()).toBe(true);
    expect(wrapper.find('.swiper-button-next-announcement').exists()).toBe(true);
  });

  it('should not render navigation buttons when only one item is visible', () => {
    const singleVisible = {
      ...mockAnnouncementBar,
      content: [
        {
          ...mockAnnouncementBar.content[0]!,
          content: { ...mockAnnouncementBar.content[0]!.content, visible: true },
        },
        {
          ...mockAnnouncementBar.content[1]!,
          content: { ...mockAnnouncementBar.content[1]!.content, visible: false },
        },
        {
          ...mockAnnouncementBar.content[2]!,
          content: { ...mockAnnouncementBar.content[2]!.content, visible: false },
        },
      ],
    };

    const wrapper = mount(AnnouncementBar, { props: singleVisible });

    expect(wrapper.find('.swiper-button-prev-announcement').exists()).toBe(false);
    expect(wrapper.find('.swiper-button-next-announcement').exists()).toBe(false);
  });

  it('should apply the controls color to navigation buttons', () => {
    const wrapper = mount(AnnouncementBar, { props: mockAnnouncementBar });
    const prevButton = wrapper.find('.swiper-button-prev-announcement');
    const nextButton = wrapper.find('.swiper-button-next-announcement');

    expect(prevButton.attributes('style')).toContain(`color: ${mockAnnouncementBar.configuration.controls.color}`);
    expect(nextButton.attributes('style')).toContain(`color: ${mockAnnouncementBar.configuration.controls.color}`);
  });
});

describe('AnnouncementBar - Layout / Inline Styles', () => {
  it('should apply the correct background color', () => {
    const wrapper = mount(AnnouncementBar, { props: mockAnnouncementBar });
    const firstSlide = wrapper.findAll('[data-testid="swiper-slide"]')[0]!;
    const innerDiv = firstSlide.find('div');

    expect(innerDiv.attributes('style')).toContain('background-color: #1a1a1a');
  });

  it('should apply the correct padding values', () => {
    const wrapper = mount(AnnouncementBar, { props: mockAnnouncementBar });
    const firstSlide = wrapper.findAll('[data-testid="swiper-slide"]')[0]!;
    const innerDiv = firstSlide.find('div');
    const style = innerDiv.attributes('style') ?? '';

    expect(style).toContain('padding: 10px 16px');
  });
});
