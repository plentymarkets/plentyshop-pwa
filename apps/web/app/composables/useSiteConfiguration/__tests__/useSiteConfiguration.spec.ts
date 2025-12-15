import { describe, it, expect, vi } from 'vitest';

const mockRoute = {
  fullPath: ref('/initial'),
};

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}));

describe('useSiteConfiguration route watcher', () => {
  it('should reset drawer state on route change', async () => {
    const { drawerOpen, drawerView, activeSetting } = useSiteConfiguration();
    mockRoute.fullPath.value = '/new-route';
    await nextTick();

    expect(drawerOpen.value).toBe(false);
    expect(drawerView.value).toBe(null);
    expect(activeSetting.value).toBe('');
  });
});
