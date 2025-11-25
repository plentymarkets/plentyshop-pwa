import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useEditModeNotification } from '../useEditModeNotification';

const send = vi.fn();

mockNuxtImport('useNotification', () => () => ({ send }));

describe('useEditModeNotification', () => {
  let disableActions: Ref<boolean>;

  beforeEach(() => {
    vi.clearAllMocks();
    disableActions = ref(false);
  });

  it('should not send notification on mount if disableActions is false', () => {
    useEditModeNotification(disableActions);
    expect(send).not.toHaveBeenCalled();
  });

  it('should send notification when disableActions transitions from false to true', async () => {
    useEditModeNotification(disableActions);
    disableActions.value = true;
    await nextTick();
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'warning',
        message: expect.stringContaining('Example Data in Edit Mode'),
      }),
    );
  });

  it('should not send notification again if already shown', async () => {
    const { notificationShown } = useEditModeNotification(disableActions);
    disableActions.value = true;
    await nextTick();
    expect(send).toHaveBeenCalledTimes(1);
    disableActions.value = false;
    await nextTick();
    disableActions.value = true;
    await nextTick();
    expect(send).toHaveBeenCalledTimes(1);
    expect(notificationShown.value).toBe(true);
  });

  it('should reset notificationShown when resetNotification is called', async () => {
    const { notificationShown, resetNotification } = useEditModeNotification(disableActions);
    disableActions.value = true;
    await nextTick();
    expect(notificationShown.value).toBe(true);
    resetNotification();
    expect(notificationShown.value).toBe(false);
  });
});
