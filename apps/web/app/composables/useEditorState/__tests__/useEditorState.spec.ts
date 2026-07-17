import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { useEditorState } from '../useEditorState';
import type { PreviewDevice } from '~/composables/useEditorDevice';

const $isPreview = ref(false);
const disableActions = ref(true);
const deviceRef = ref<PreviewDevice>('desktop');

mockNuxtImport('useNuxtApp', () => () => ({
  $isPreview: $isPreview.value,
}));

mockNuxtImport('useEditor', () => () => ({
  disableActions,
}));

mockNuxtImport('useEditorDevice', () => () => ({
  device: deviceRef,
  width: computed(() => {
    if (deviceRef.value === 'mobile') return '375px';
    if (deviceRef.value === 'tablet') return '768px';
    return '100%';
  }),
  setDevice: vi.fn(),
}));

describe('useEditorState', () => {
  describe('when in live mode', () => {
    beforeEach(() => {
      $isPreview.value = false;
      disableActions.value = true;
    });

    it('should return correct live mode state', () => {
      const state = useEditorState();
      expect(state.isInEditor.value).toBe(false);
      expect(state.isLiveMode.value).toBe(true);
      expect(state.isEditMode.value).toBe(false);
      expect(state.isPreviewMode.value).toBe(false);
    });

    it('should not show editor UI', () => {
      const state = useEditorState();
      expect(state.shouldShowEditorUI.value).toBe(false);
    });

    it('should not use fake data', () => {
      const state = useEditorState();
      expect(state.shouldUseFakeData.value).toBe(false);
    });

    it('should hide zero values', () => {
      const state = useEditorState();
      expect(state.shouldHideZeroValues.value).toBe(true);
    });

    it('should not enable editor features', () => {
      const state = useEditorState();
      expect(state.shouldEnableEditorFeatures.value).toBe(false);
    });
  });

  describe('when in edit mode', () => {
    beforeEach(() => {
      $isPreview.value = true;
      disableActions.value = true;
    });

    it('should return correct edit mode state', () => {
      const state = useEditorState();
      expect(state.isInEditor.value).toBe(true);
      expect(state.isEditMode.value).toBe(true);
      expect(state.isPreviewMode.value).toBe(false);
      expect(state.isLiveMode.value).toBe(false);
    });

    it('should show editor UI', () => {
      const state = useEditorState();
      expect(state.shouldShowEditorUI.value).toBe(true);
    });

    it('should use fake data', () => {
      const state = useEditorState();
      expect(state.shouldUseFakeData.value).toBe(true);
    });

    it('should not hide zero values', () => {
      const state = useEditorState();
      expect(state.shouldHideZeroValues.value).toBe(false);
    });

    it('should enable editor features', () => {
      const state = useEditorState();
      expect(state.shouldEnableEditorFeatures.value).toBe(true);
    });
  });

  describe('when in preview mode', () => {
    beforeEach(() => {
      $isPreview.value = true;
      disableActions.value = false;
    });

    it('should return correct preview mode state', () => {
      const state = useEditorState();
      expect(state.isInEditor.value).toBe(true);
      expect(state.isPreviewMode.value).toBe(true);
      expect(state.isEditMode.value).toBe(false);
      expect(state.isLiveMode.value).toBe(false);
    });

    it('should not show editor UI', () => {
      const state = useEditorState();
      expect(state.shouldShowEditorUI.value).toBe(false);
    });

    it('should not use fake data', () => {
      const state = useEditorState();
      expect(state.shouldUseFakeData.value).toBe(false);
    });

    it('should hide zero values', () => {
      const state = useEditorState();
      expect(state.shouldHideZeroValues.value).toBe(true);
    });

    it('should not enable editor features', () => {
      const state = useEditorState();
      expect(state.shouldEnableEditorFeatures.value).toBe(false);
    });
  });

  describe('client-side hydration support', () => {
    beforeEach(() => {
      $isPreview.value = true;
      disableActions.value = true;
    });

    it('should initialize isInEditorClient as false', () => {
      const state = useEditorState();
      expect(state.isInEditorClient.value).toBe(false);
    });
  });

  describe('isMobilePreview', () => {
    beforeEach(() => {
      deviceRef.value = 'desktop';
    });

    it('is false when isInEditorClient is false regardless of device', () => {
      deviceRef.value = 'mobile';
      const state = useEditorState();
      expect(state.isMobilePreview.value).toBe(false);
    });

    it('is true when isInEditorClient is true and device is mobile', () => {
      const state = useEditorState();
      state.isInEditorClient.value = true;
      deviceRef.value = 'mobile';
      expect(state.isMobilePreview.value).toBe(true);
    });

    it('is true when isInEditorClient is true and device is tablet', () => {
      const state = useEditorState();
      state.isInEditorClient.value = true;
      deviceRef.value = 'tablet';
      expect(state.isMobilePreview.value).toBe(true);
    });

    it('is false when isInEditorClient is true but device is desktop', () => {
      const state = useEditorState();
      state.isInEditorClient.value = true;
      deviceRef.value = 'desktop';
      expect(state.isMobilePreview.value).toBe(false);
    });
  });

  describe('previewWidth', () => {
    it('returns 375px for mobile device', () => {
      deviceRef.value = 'mobile';
      const { previewWidth } = useEditorState();
      expect(previewWidth.value).toBe('375px');
    });

    it('returns 768px for tablet device', () => {
      deviceRef.value = 'tablet';
      const { previewWidth } = useEditorState();
      expect(previewWidth.value).toBe('768px');
    });

    it('returns 100% for desktop device', () => {
      deviceRef.value = 'desktop';
      const { previewWidth } = useEditorState();
      expect(previewWidth.value).toBe('100%');
    });
  });
});
