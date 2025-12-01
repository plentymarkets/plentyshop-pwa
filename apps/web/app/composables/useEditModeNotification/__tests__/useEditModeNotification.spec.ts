import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useEditModeNotification } from '../useEditModeNotification';

const send = vi.fn();

mockNuxtImport('useNotification', () => () => ({ send }));
mockNuxtImport('useNuxtApp', () => () => ({ $isPreview: true }));
mockNuxtImport('useEditor', () => () => ({ disableActions: ref(false) }));

describe('useEditModeNotification', () => {
  let disableActions: Ref<boolean>;

  beforeEach(() => {
    vi.clearAllMocks();
    disableActions = ref(false);
  });

  it('should not send notification on mount if editor is in preview mode is false', () => {
    useEditModeNotification(disableActions);
    expect(send).not.toHaveBeenCalled();
  });

  it('should send notification when editor switches from preview to edit mode', async () => {
    useEditModeNotification(disableActions);
    disableActions.value = true;
    await nextTick();
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'warning',
        message: expect.stringMatching(/.+/),
      }),
    );
  });

  it('should not send notification again if already shown', async () => {
    const { notificationShown } = useEditModeNotification(disableActions);
    disableActions.value = true;
    await nextTick();
    disableActions.value = false;
    await nextTick();
    disableActions.value = true;
    await nextTick();
    expect(send).toHaveBeenCalledTimes(1);
    expect(notificationShown.value).toBe(true);
  });

  it('should hide the notification', async () => {
    const { notificationShown, resetNotification } = useEditModeNotification(disableActions);
    disableActions.value = true;
    await nextTick();
    expect(notificationShown.value).toBe(true);
    resetNotification();
    expect(notificationShown.value).toBe(false);
  });
});
