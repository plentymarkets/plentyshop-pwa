import { describe, it, expect, vi, beforeEach, afterAll, beforeAll } from 'vitest';
import { handleLogout } from '../logout';

const reloadMock = vi.fn();

beforeAll(() => {
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: { reload: reloadMock },
  });
});

afterAll(() => {
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: window.location,
  });
});

describe('auth utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call toggle, then logout, then reload the page', async () => {
    const logout = vi.fn(() => Promise.resolve());
    const toggle = vi.fn();

    await handleLogout({ logout, toggle });

    expect(toggle).toHaveBeenCalledOnce();
    expect(logout).toHaveBeenCalledOnce();
    expect(reloadMock).toHaveBeenCalledOnce();

    // Ensure the order of execution
    const toggleOrder = toggle.mock.invocationCallOrder[0];
    const logoutOrder = logout.mock.invocationCallOrder[0];
    const reloadOrder = reloadMock.mock.invocationCallOrder[0];

    expect(toggleOrder).toBeLessThan(logoutOrder!);
    expect(logoutOrder).toBeLessThan(reloadOrder!);
  });
});
