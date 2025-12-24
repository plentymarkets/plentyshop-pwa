import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mockNuxtImport } from '@nuxt/test-utils/runtime';
import { nextTick } from 'vue';
import { useResetProductPageModal } from '../useResetProductPageModal';

const mockSend = vi.fn();
const { useNotification } = vi.hoisted(() => {
  return {
    useNotification: vi.fn(() => ({
      send: mockSend,
    })),
  };
});

const { useSdk } = vi.hoisted(() => {
  return {
    useSdk: vi.fn(() => ({
      plentysystems: {
        deleteBlocks: vi.fn(),
      },
    })),
  };
});

mockNuxtImport('useNotification', () => useNotification);
mockNuxtImport('useSdk', () => useSdk);

describe('useResetProductPageModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should initialize with correct default values', () => {
      const { unlinkModalOpen, resetType } = useResetProductPageModal();

      expect(unlinkModalOpen.value).toBe(false);
      expect(resetType.value).toBe('');
    });
  });

  describe('toggleResetModal', () => {
    it('should toggle modal open/closed without changing resetType', () => {
      const { unlinkModalOpen, resetType, toggleResetModal } = useResetProductPageModal();

      toggleResetModal(true);
      expect(unlinkModalOpen.value).toBe(true);
      expect(resetType.value).toBe('');

      toggleResetModal(false);
      expect(unlinkModalOpen.value).toBe(false);
    });

    it('should set resetType when provided', () => {
      const { unlinkModalOpen, resetType, toggleResetModal } = useResetProductPageModal();

      toggleResetModal(true, 'category');
      expect(unlinkModalOpen.value).toBe(true);
      expect(resetType.value).toBe('category');
    });

    it('should toggle modal and update resetType to product', () => {
      const { unlinkModalOpen, resetType, toggleResetModal } = useResetProductPageModal();

      toggleResetModal(true, 'product');
      expect(unlinkModalOpen.value).toBe(true);
      expect(resetType.value).toBe('product');

      toggleResetModal(false);
      expect(unlinkModalOpen.value).toBe(false);
      expect(resetType.value).toBe('product');
    });

    it('should update resetType on subsequent toggleResetModal calls', () => {
      const { resetType, toggleResetModal } = useResetProductPageModal();

      toggleResetModal(true, 'category');
      expect(resetType.value).toBe('category');

      toggleResetModal(true, 'product');
      expect(resetType.value).toBe('product');
    });
  });

  describe('deleteBlocks', () => {
    it('should successfully delete blocks and send positive notification', async () => {
      const deleteBlocksMock = vi.fn().mockResolvedValue({});
      useSdk.mockReturnValue({
        plentysystems: {
          deleteBlocks: deleteBlocksMock,
        },
      });

      const { deleteBlocks, unlinkModalOpen } = useResetProductPageModal();

      const deletePromise = deleteBlocks(0, 'category');
      await nextTick();

      await deletePromise;
      await nextTick();

      expect(deleteBlocksMock).toHaveBeenCalledWith({ identifier: 0, type: 'category' });
      expect(mockSend).toHaveBeenCalledWith({
        type: 'positive',
        message: 'Blocks deleted successfully. Please refresh the page.',
      });

      expect(unlinkModalOpen.value).toBe(false);
    });

    it('should call deleteBlocks with correct parameters for detail type', async () => {
      const deleteBlocksMock = vi.fn().mockResolvedValue({});
      useSdk.mockReturnValue({
        plentysystems: {
          deleteBlocks: deleteBlocksMock,
        },
      });

      const { deleteBlocks } = useResetProductPageModal();

      await deleteBlocks(5, 'product');

      expect(deleteBlocksMock).toHaveBeenCalledWith({ identifier: 5, type: 'product' });
    });

    it('should handle error and send negative notification', async () => {
      const error = new Error('API Error');
      const deleteBlocksMock = vi.fn().mockRejectedValue(error);
      useSdk.mockReturnValue({
        plentysystems: {
          deleteBlocks: deleteBlocksMock,
        },
      });

      const { deleteBlocks, unlinkModalOpen } = useResetProductPageModal();

      const deletePromise = deleteBlocks(0, 'category');
      await nextTick();

      await deletePromise;
      await nextTick();

      expect(mockSend).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'negative',
          message: expect.stringContaining('An error occurred while deleting blocks.'),
        }),
      );
      expect(unlinkModalOpen.value).toBe(false);
    });

    it('should close modal after successful deletion', async () => {
      const deleteBlocksMock = vi.fn().mockResolvedValue({});
      useSdk.mockReturnValue({
        plentysystems: {
          deleteBlocks: deleteBlocksMock,
        },
      });

      const { deleteBlocks, unlinkModalOpen, toggleResetModal } = useResetProductPageModal();

      toggleResetModal(true, 'category');
      expect(unlinkModalOpen.value).toBe(true);

      await deleteBlocks(0, 'category');
      await nextTick();

      expect(unlinkModalOpen.value).toBe(false);
    });
  });
});
