import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { mount } from '@vue/test-utils';
import { useEditorUnsavedChangesGuard } from '../useEditorUnsavedChangesGuard';

const { useEditor } = vi.hoisted(() => ({
  useEditor: vi.fn(() => ({
    isEditingEnabled: ref(false),
  })),
}));

const { useSiteSettings } = vi.hoisted(() => ({
  useSiteSettings: vi.fn(() => ({
    settingsIsDirty: ref(false),
  })),
}));

const { useSiteConfiguration } = vi.hoisted(() => ({
  useSiteConfiguration: vi.fn(() => ({
    closeDrawer: vi.fn(),
  })),
}));

const { getEditorUITranslation } = vi.hoisted(() => ({
  getEditorUITranslation: vi.fn((key: string) => `Translated: ${key}`),
}));

const { useBlockTemplates } = vi.hoisted(() => ({
  useBlockTemplates: vi.fn(() => ({
    resetFooterToSaved: vi.fn().mockResolvedValue(undefined),
    resetHeaderToSaved: vi.fn().mockResolvedValue(undefined),
  })),
}));

mockNuxtImport('useEditor', () => useEditor);
mockNuxtImport('useSiteSettings', () => useSiteSettings);
mockNuxtImport('useSiteConfiguration', () => useSiteConfiguration);
mockNuxtImport('useBlockTemplates', () => useBlockTemplates);
mockNuxtImport('getEditorUITranslation', () => getEditorUITranslation);

let mockOnBeforeRouteLeave: ((callback: () => Promise<boolean | undefined>) => void) | null = null;

vi.mock('vue-router', () => ({
  onBeforeRouteLeave: (callback: () => Promise<boolean | undefined>) => {
    if (mockOnBeforeRouteLeave) {
      mockOnBeforeRouteLeave(callback);
    }
  },
}));

describe('useEditorUnsavedChangesGuard', () => {
  let isEditingEnabled: Ref<boolean>;
  let settingsIsDirty: Ref<boolean>;
  let closeDrawer: ReturnType<typeof vi.fn>;
  let resetFooterToSaved: ReturnType<typeof vi.fn>;
  let resetHeaderToSaved: ReturnType<typeof vi.fn>;
  let beforeUnloadHandler: ((event: BeforeUnloadEvent) => void) | null = null;
  let routeLeaveCallback: (() => Promise<boolean | undefined>) | null = null;

  beforeEach(() => {
    vi.clearAllMocks();

    isEditingEnabled = ref<boolean>(false);
    settingsIsDirty = ref<boolean>(false);
    closeDrawer = vi.fn();
    resetFooterToSaved = vi.fn().mockResolvedValue(undefined);
    resetHeaderToSaved = vi.fn().mockResolvedValue(undefined);

    useEditor.mockReturnValue({
      isEditingEnabled,
    });

    useSiteSettings.mockReturnValue({
      settingsIsDirty,
    });

    useSiteConfiguration.mockReturnValue({
      closeDrawer,
    });

    useBlockTemplates.mockReturnValue({
      resetFooterToSaved,
      resetHeaderToSaved,
    });

    vi.spyOn(window, 'addEventListener').mockImplementation(
      (event: string, handler: EventListenerOrEventListenerObject) => {
        if (event === 'beforeunload') {
          beforeUnloadHandler = handler as (event: BeforeUnloadEvent) => void;
        }
      },
    );

    vi.spyOn(window, 'removeEventListener').mockImplementation(() => {});

    mockOnBeforeRouteLeave = (callback) => {
      routeLeaveCallback = callback;
    };
  });

  afterEach(() => {
    beforeUnloadHandler = null;
    routeLeaveCallback = null;
    mockOnBeforeRouteLeave = null;
    vi.restoreAllMocks();
  });

  describe('initialization', () => {
    it('should set up beforeunload listener when enabled', () => {
      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      expect(window.addEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });

    it('should not set up listeners when disabled', () => {
      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard({ enabled: false });
          return () => null;
        },
      };

      mount(TestComponent);

      expect(window.addEventListener).not.toHaveBeenCalled();
    });

    it('should remove beforeunload listener on unmount', () => {
      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      const wrapper = mount(TestComponent);
      wrapper.unmount();

      expect(window.removeEventListener).toHaveBeenCalledWith('beforeunload', expect.any(Function));
    });
  });

  describe('beforeUnload handler', () => {
    it('should not prevent unload when there are no changes', () => {
      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      const event = new Event('beforeunload') as BeforeUnloadEvent;
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      isEditingEnabled.value = false;
      settingsIsDirty.value = false;

      beforeUnloadHandler?.(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });

    it('should prevent unload when editing is enabled', () => {
      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      const event = new Event('beforeunload') as BeforeUnloadEvent;
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      isEditingEnabled.value = true;
      settingsIsDirty.value = false;

      beforeUnloadHandler?.(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent unload when settings are dirty', () => {
      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      const event = new Event('beforeunload') as BeforeUnloadEvent;
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      isEditingEnabled.value = false;
      settingsIsDirty.value = true;

      beforeUnloadHandler?.(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should use custom hasUnsavedChanges function', () => {
      const customHasUnsavedChanges = vi.fn(() => true);

      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard({ hasUnsavedChanges: customHasUnsavedChanges });
          return () => null;
        },
      };

      mount(TestComponent);

      const event = new Event('beforeunload') as BeforeUnloadEvent;
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      isEditingEnabled.value = false;
      settingsIsDirty.value = false;

      beforeUnloadHandler?.(event);

      expect(customHasUnsavedChanges).toHaveBeenCalled();
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('route leave guard', () => {
    it('should allow navigation when there are no changes', async () => {
      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      isEditingEnabled.value = false;
      settingsIsDirty.value = false;

      const result = await routeLeaveCallback?.();

      expect(result).toBeUndefined();
    });

    it('should show confirmation and allow navigation when user confirms', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      isEditingEnabled.value = true;

      const result = await routeLeaveCallback?.();

      expect(confirmSpy).toHaveBeenCalledWith('Translated: unsaved-changes-confirm');
      expect(resetFooterToSaved).toHaveBeenCalled();
      expect(result).toBe(true);
      expect(closeDrawer).toHaveBeenCalled();
    });

    it('should show confirmation and prevent navigation when user cancels', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      isEditingEnabled.value = true;

      const result = await routeLeaveCallback?.();

      expect(confirmSpy).toHaveBeenCalledWith('Translated: unsaved-changes-confirm');
      expect(result).toBe(false);
      expect(closeDrawer).not.toHaveBeenCalled();
    });

    it('should check for unsaved changes when settings are dirty', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      isEditingEnabled.value = false;
      settingsIsDirty.value = true;

      await routeLeaveCallback?.();

      expect(confirmSpy).toHaveBeenCalled();
    });

    it('should use custom hasUnsavedChanges for route leave', async () => {
      const customHasUnsavedChanges = vi.fn(() => true);
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard({ hasUnsavedChanges: customHasUnsavedChanges });
          return () => null;
        },
      };

      mount(TestComponent);

      isEditingEnabled.value = false;
      settingsIsDirty.value = false;

      await routeLeaveCallback?.();

      expect(customHasUnsavedChanges).toHaveBeenCalled();
      expect(confirmSpy).toHaveBeenCalled();
    });
  });

  describe('custom onConfirmLeave callback', () => {
    it('should call custom onConfirmLeave instead of closeDrawer', async () => {
      const customOnConfirmLeave = vi.fn();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard({ onConfirmLeave: customOnConfirmLeave });
          return () => null;
        },
      };

      mount(TestComponent);

      isEditingEnabled.value = true;

      await routeLeaveCallback?.();

      expect(confirmSpy).toHaveBeenCalled();
      expect(resetFooterToSaved).toHaveBeenCalled();
      expect(customOnConfirmLeave).toHaveBeenCalled();
      expect(closeDrawer).not.toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle both editing and dirty settings simultaneously', async () => {
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      const event = new Event('beforeunload') as BeforeUnloadEvent;
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      isEditingEnabled.value = true;
      settingsIsDirty.value = true;

      beforeUnloadHandler?.(event);
      expect(preventDefaultSpy).toHaveBeenCalled();

      await routeLeaveCallback?.();
      expect(confirmSpy).toHaveBeenCalled();
    });

    it('should handle reactive state changes', async () => {
      const TestComponent = {
        setup() {
          useEditorUnsavedChangesGuard();
          return () => null;
        },
      };

      mount(TestComponent);

      const event = new Event('beforeunload') as BeforeUnloadEvent;
      let preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      isEditingEnabled.value = false;
      beforeUnloadHandler?.(event);
      expect(preventDefaultSpy).not.toHaveBeenCalled();

      preventDefaultSpy = vi.spyOn(event, 'preventDefault');
      settingsIsDirty.value = true;
      await nextTick();
      beforeUnloadHandler?.(event);
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});
