export const ALLOWED_MIME = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/svg+xml',
  'image/svg',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/ico',
]);
export const ALLOWED_EXT = new Set(['svg', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'ico']);

export const ALLOWED_ACCEPT =
  'image/avif,image/webp,image/png,image/jpeg,image/svg+xml,.svg, image/x-icon,image/vnd.microsoft.icon,.ico';

export const MAX_BYTES = 512 * 1024 * 1024;

export type InvalidCb = (reason: string) => void;

export const validateImageFile = (file: File): { ok: true } | { ok: false; reason: string } => {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!ALLOWED_EXT.has(ext)) {
    return { ok: false, reason: `Only ${Array.from(ALLOWED_EXT).join(', ').toUpperCase()} files are allowed.` };
  }
  const mime = (file.type || '').toLowerCase();

  const isSvg = ext === 'svg';
  const svgOK = isSvg && (!mime || /^image\/svg(\+xml)?$/.test(mime));

  const isIco = ext === 'ico';
  const icoOK = isIco && (!mime || /^(image\/x-icon|image\/vnd\.microsoft\.icon|image\/ico)$/.test(mime));

  if (!ALLOWED_MIME.has(mime) && !svgOK && !icoOK) {
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
