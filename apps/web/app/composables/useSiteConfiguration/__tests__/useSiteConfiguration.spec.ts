import { describe, it, expect, vi } from 'vitest';

const mockRoute = {
  fullPath: ref('/initial'),
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}));

describe('useSiteConfiguration route watcher', () => {
  it('should reset blocks configuration drawer state on route change when blocksSettings is open', async () => {
    const { blocksConfigurationDrawerOpen, blocksConfigurationDrawerView } = useSiteConfiguration();
    mockRoute.fullPath.value = '/new-route';
    await nextTick();

    expect(blocksConfigurationDrawerOpen.value).toBe(false);
    expect(blocksConfigurationDrawerView.value).toBe(null);
  });

  it('should preserve site configuration drawer state on route change', async () => {
    const { siteConfigurationDrawerOpen, siteConfigurationDrawerView } = useSiteConfiguration();

    mockRoute.fullPath.value = '/new-route';
    await nextTick();

    expect(siteConfigurationDrawerOpen.value).toBe(false);
    expect(siteConfigurationDrawerView.value).toBe(null);
  });
});
