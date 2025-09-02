export const ALLOWED_MIME = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/avif']);
export const ALLOWED_EXT = new Set(['png', 'jpg', 'jpeg', 'webp', 'avif']);

export const ALLOWED_ACCEPT = 'image/avif,image/webp,image/png,image/jpeg';

export const MAX_BYTES = 512 * 1024 * 1024;

export type InvalidCb = (reason: string) => void;

export const validateImageFile = (file: File): { ok: true } | { ok: false; reason: string } => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXT.has(ext)) {
    return { ok: false, reason: `Only ${Array.from(ALLOWED_EXT).join(', ').toUpperCase()} files are allowed.` };
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return { ok: false, reason: `Invalid file type: ${file.type || 'unknown'}.` };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, reason: `File too large. Max ${(MAX_BYTES / (1024 * 1024)).toFixed(0)}MB.` };
  }
  return { ok: true };
};
export const makeHandleFileChange = (onSelected: (file: File) => void, onInvalid?: InvalidCb) => {
  return (event: Event) => {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (file) {
      const result = validateImageFile(file);
      if (result.ok) onSelected(file);
      else onInvalid?.(result.reason);
    }
    if (input) input.value = '';
  };
};
export const makeHandleDrop = (onSelected: (file: File) => void, onInvalid?: InvalidCb) => {
  return (event: DragEvent) => {
    event.preventDefault?.();
    const file = event.dataTransfer?.files?.[0] ?? null;
    if (file) {
      const result = validateImageFile(file);
      if (result.ok) onSelected(file);
      else onInvalid?.(result.reason);
    }
  };
};
