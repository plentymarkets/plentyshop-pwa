import { describe, it, expect } from 'vitest';
import { FileTypeValidator } from '../FileTypeValidator';

describe('FileTypeValidator', () => {
  it('should accept a .ico file as an icon', () => {
    expect(FileTypeValidator.isIcon('favicon.ico')).toBe(true);
  });

  it('should reject a file with a different file type as an icon', () => {
    expect(FileTypeValidator.isIcon('favicon.png')).toBe(false);
  });

  it('should accept a .png file as an image', () => {
    expect(FileTypeValidator.isImage('image.png')).toBe(true);
  });

  it('should accept a .jpg file as an image', () => {
    expect(FileTypeValidator.isImage('image.jpg')).toBe(true);
  });

  it('should accept a .jpeg file as an image', () => {
    expect(FileTypeValidator.isImage('image.jpeg')).toBe(true);
  });

  it('should accept a .gif file as an image', () => {
    expect(FileTypeValidator.isImage('image.gif')).toBe(true);
  });

  it('should accept a .svg file as an image', () => {
    expect(FileTypeValidator.isImage('image.svg')).toBe(true);
  });

  it('should accept a .avif file as an image', () => {
    expect(FileTypeValidator.isImage('image.avif')).toBe(true);
  });

  it('should accept a .webp file as an image', () => {
    expect(FileTypeValidator.isImage('image.webp')).toBe(true);
  });

  it('should reject a file with a different file type as an image', () => {
    expect(FileTypeValidator.isImage('image.ico')).toBe(false);
  });
});
