import { describe, it, expect, vi } from 'vitest';
import { AssetDownloader } from '../AssetDownloader';
import { FileTypeValidator } from '../../validators/FileTypeValidator';
import type { Writer } from '../../writers/types';
import type { Logger } from '../../logs/types';
import path from 'path';

describe('AssetDownloader', () => {
  let writerMock: Writer;
  let loggerMock: Logger;
  let assetDownloader: AssetDownloader;

  beforeEach(() => {
    writerMock = {
      write: vi.fn(),
      writeMissing: vi.fn()
    };
    loggerMock = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn()
    };
    assetDownloader = new AssetDownloader(writerMock, loggerMock);
  });

  describe('downloadFavicon', () => {
    it('should log a warning if the URL is not an icon', () => {
      vi.spyOn(FileTypeValidator, 'isIcon').mockReturnValue(false);
      const url = 'http://example.com/image.png';

      assetDownloader.downloadFavicon(url);

      expect(loggerMock.warn).toHaveBeenCalled();
      expect(writerMock.write).not.toHaveBeenCalled();
    });

    it('should download the favicon if the URL is an icon', () => {
      vi.spyOn(FileTypeValidator, 'isIcon').mockReturnValue(true);
      const url = 'http://example.com/favicon.ico';
      const expectedPath = path.resolve(__dirname, `../../../public/favicon.ico`);

      assetDownloader.downloadFavicon(url);

      expect(loggerMock.info).toHaveBeenCalled();
      expect(writerMock.write).toHaveBeenCalledWith(url, expectedPath);
    });
  });

  describe('downloadLogo', () => {
    it('should log a warning if the URL is not an image', () => {
      vi.spyOn(FileTypeValidator, 'isImage').mockReturnValue(false);
      const url = 'http://example.com/file.txt';

      assetDownloader.downloadLogo(url);

      expect(loggerMock.warn).toHaveBeenCalled();
      expect(writerMock.write).not.toHaveBeenCalled();
    });

    it('should download the logo if the URL is an image', () => {
      vi.spyOn(FileTypeValidator, 'isImage').mockReturnValue(true);
      const url = 'http://example.com/logo.png';
      const expectedPath = path.resolve(__dirname, `../../../public/images/logo.png`);

      assetDownloader.downloadLogo(url);

      expect(loggerMock.info).toHaveBeenCalled();
      expect(writerMock.write).toHaveBeenCalledWith(url, expectedPath);
    });
  });
});
