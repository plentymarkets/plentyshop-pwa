import { mount } from '@vue/test-utils';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { useLazyProductImage } from '../useLazyProductImage';

type TestExpose = ReturnType<typeof useLazyProductImage>;

let lastObserverCallback: ((entries: Partial<IntersectionObserverEntry>[]) => void) | null = null;
let observeMock: ReturnType<typeof vi.fn>;
let disconnectMock: ReturnType<typeof vi.fn>;
let originalIntersectionObserver: typeof globalThis.IntersectionObserver | undefined;

const mountComposable = ({
  priority = false,
  hoverImageUrl = '',
}: {
  priority?: boolean;
  hoverImageUrl?: string;
} = {}) => {
  const priorityRef = ref(priority);
  const hoverImageUrlRef = ref(hoverImageUrl);

  let exposed!: TestExpose;

  const TestComponent = defineComponent({
    setup() {
      exposed = useLazyProductImage({
        priority: priorityRef,
        hoverImageUrl: hoverImageUrlRef,
      });

      return () => h('div', { ref: exposed.imageContainerRef });
    },
  });

  const wrapper = mount(TestComponent);

  return {
    wrapper,
    exposed,
    priorityRef,
    hoverImageUrlRef,
  };
};

describe('useLazyProductImage', () => {
  beforeEach(() => {
    originalIntersectionObserver = globalThis.IntersectionObserver;

    observeMock = vi.fn();
    disconnectMock = vi.fn();

    class MockIntersectionObserver {
      constructor(callback: (entries: Partial<IntersectionObserverEntry>[]) => void) {
        lastObserverCallback = callback;
      }

      observe = observeMock;
      disconnect = disconnectMock;
    }

    globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof globalThis.IntersectionObserver;
  });

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver!;
    lastObserverCallback = null;
    vi.restoreAllMocks();
  });

  it('should load immediately when priority is true', async () => {
    const { exposed } = mountComposable({
      priority: true,
      hoverImageUrl: 'https://cdn.example.com/hover.jpg',
    });

    await nextTick();

    expect(exposed.shouldLoadMainImage.value).toBe(true);
    expect(exposed.shouldLoadHoverImage.value).toBe(true);
    expect(observeMock).not.toHaveBeenCalled();
  });

  it('should defer loading until IntersectionObserver callback intersects', async () => {
    const { exposed } = mountComposable({
      priority: false,
      hoverImageUrl: 'https://cdn.example.com/hover.jpg',
    });

    await nextTick();

    expect(exposed.shouldLoadMainImage.value).toBe(false);
    expect(exposed.shouldLoadHoverImage.value).toBe(false);
    expect(observeMock).toHaveBeenCalledTimes(1);

    lastObserverCallback?.([{ isIntersecting: false }]);
    expect(exposed.shouldLoadMainImage.value).toBe(false);
    expect(exposed.shouldLoadHoverImage.value).toBe(false);

    lastObserverCallback?.([{ isIntersecting: true }]);
    expect(exposed.shouldLoadMainImage.value).toBe(true);
    expect(exposed.shouldLoadHoverImage.value).toBe(true);
    expect(disconnectMock).toHaveBeenCalledTimes(1);
  });

  it('should enable hover image when hoverImageUrl becomes truthy after main image is allowed to load', async () => {
    const { exposed, hoverImageUrlRef } = mountComposable({
      priority: true,
      hoverImageUrl: '',
    });

    await nextTick();

    expect(exposed.shouldLoadMainImage.value).toBe(true);
    expect(exposed.shouldLoadHoverImage.value).toBe(false);

    hoverImageUrlRef.value = 'https://cdn.example.com/hover.jpg';
    await nextTick();

    expect(exposed.shouldLoadHoverImage.value).toBe(true);
  });

  it('should fall back to eager loading when IntersectionObserver is unavailable', async () => {
    // @ts-expect-error test override
    delete globalThis.IntersectionObserver;

    const { exposed } = mountComposable({
      priority: false,
      hoverImageUrl: 'https://cdn.example.com/hover.jpg',
    });

    await nextTick();

    expect(exposed.shouldLoadMainImage.value).toBe(true);
    expect(exposed.shouldLoadHoverImage.value).toBe(true);
  });
});
