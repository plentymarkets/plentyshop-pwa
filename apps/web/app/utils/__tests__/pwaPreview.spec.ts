import { describe, it, expect, vi } from 'vitest';
import { resolvePreviewState } from '../pwaPreview';

const getPreviewValid = vi.fn();

describe('resolvePreviewState', () => {
  it('should return true immediately when isPreviewConfig is true, without calling the SDK', async () => {
    const result = await resolvePreviewState({
      cookieValue: null,
      isPreviewConfig: true,
      getPreviewValid,
    });

    expect(result).toBe(true);
    expect(getPreviewValid).not.toHaveBeenCalled();
  });

  it('should return false when there is no cookie and isPreviewConfig is false', async () => {
    const result = await resolvePreviewState({
      cookieValue: null,
      isPreviewConfig: false,
      getPreviewValid,
    });

    expect(result).toBe(false);
    expect(getPreviewValid).not.toHaveBeenCalled();
  });

  it('should return true when cookie is present and the response is valid with write permission', async () => {
    getPreviewValid.mockResolvedValueOnce({ valid: true, permission: 'write' });

    const result = await resolvePreviewState({
      cookieValue: 'some-token',
      isPreviewConfig: false,
      getPreviewValid,
    });

    expect(result).toBe(true);
    expect(getPreviewValid).toHaveBeenCalledOnce();
  });

  it('should return false when the response is valid but the permission is not write', async () => {
    getPreviewValid.mockResolvedValueOnce({ valid: true, permission: 'read' });

    const result = await resolvePreviewState({
      cookieValue: 'some-token',
      isPreviewConfig: false,
      getPreviewValid,
    });

    expect(result).toBe(false);
  });

  it('should return false when the response is not valid', async () => {
    getPreviewValid.mockResolvedValueOnce({ valid: false, permission: 'write' });

    const result = await resolvePreviewState({
      cookieValue: 'some-token',
      isPreviewConfig: false,
      getPreviewValid,
    });

    expect(result).toBe(false);
  });

  it('should return false when the response is empty', async () => {
    getPreviewValid.mockResolvedValueOnce(null);

    const result = await resolvePreviewState({
      cookieValue: 'some-token',
      isPreviewConfig: false,
      getPreviewValid,
    });

    expect(result).toBe(false);
  });

  it('should propagate SDK errors so the caller can handle them', async () => {
    getPreviewValid.mockRejectedValueOnce(new Error('network error'));

    await expect(
      resolvePreviewState({
        cookieValue: 'some-token',
        isPreviewConfig: false,
        getPreviewValid,
      }),
    ).rejects.toThrow('network error');
  });
});
