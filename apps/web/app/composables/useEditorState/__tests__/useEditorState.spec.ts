import { describe, it, expect, beforeEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { ref } from 'vue';
import { useEditorState } from '../useEditorState';

const $isPreview = ref(false);
const disableActions = ref(true);

mockNuxtImport('useNuxtApp', () => () => ({
  $isPreview: $isPreview.value,
}));

mockNuxtImport('useEditor', () => () => ({
  disableActions,
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
});
