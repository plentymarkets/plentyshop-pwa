import { deflateSync } from 'node:zlib';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const BIT_DEPTH = 8;
const COLOR_TYPE_RGB = 2;
const BYTES_PER_PIXEL = 3;

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

function crc32(buffer: Buffer): number {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const typeAndData = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

/**
 * Creates a solid-colour RGB PNG without any image dependency.
 * Used for the placeholder icons and previews a new extension needs to pass marketplace validation.
 *
 * @param width - Image width in pixels
 * @param height - Image height in pixels
 * @param rgb - Fill colour as `[red, green, blue]` (0-255)
 */
export function createPlaceholderPng(width: number, height: number, rgb: readonly [number, number, number]): Buffer {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = BIT_DEPTH;
  header[9] = COLOR_TYPE_RGB;

  // Each scanline is prefixed with filter type 0 (none).
  const row = Buffer.alloc(1 + width * BYTES_PER_PIXEL);
  for (let x = 0; x < width; x++) {
    row.set(rgb, 1 + x * BYTES_PER_PIXEL);
  }
  const raw = Buffer.concat(Array.from({ length: height }, () => row));

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk('IHDR', header),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}
