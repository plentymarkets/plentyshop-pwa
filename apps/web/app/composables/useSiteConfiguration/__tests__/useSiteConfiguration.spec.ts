import { describe, it, expect, vi } from 'vitest';

const mockRoute = {
  fullPath: ref('/initial'),
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}));

describe('useSiteConfiguration route watcher', () => {
  it('should reset right drawer state on route change when blocksSettings is open', async () => {
    const { drawerOpenRight, drawerViewRight } = useSiteConfiguration();
    mockRoute.fullPath.value = '/new-route';
    await nextTick();

    expect(drawerOpenRight.value).toBe(false);
    expect(drawerViewRight.value).toBe(null);
  });

  it('should preserve left drawer state on route change', async () => {
    const { drawerOpenLeft, drawerViewLeft } = useSiteConfiguration();

    mockRoute.fullPath.value = '/new-route';
    await nextTick();

    expect(drawerOpenLeft.value).toBe(false);
    expect(drawerViewLeft.value).toBe(null);
  });
});
