import { describe, it, expect, vi } from 'vitest';
import { AppConfigurator } from '../AppConfigurator';
import type { Writer } from '../../writers/types';
import type { Logger } from '../../logs/types';

describe('AppConfigurator', () => {
  let writerMock: Writer;
  let loggerMock: Logger;

  beforeEach(() => {
    writerMock = {
      write: vi.fn(),
      writeMissing: vi.fn(),
    };
    loggerMock = {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    };
  });

  describe('generate language files', () => {
    it('should generate language files for the given language list', () => {
      const configurator = new AppConfigurator(writerMock, loggerMock);
      const writerSpy = vi.spyOn(writerMock, 'writeMissing');
      const loggerSpy = vi.spyOn(loggerMock, 'info');
      const languages = {
        default: 'en',
        activated: 'en,de',
      };

      configurator.generateLanguageFiles(languages);
      expect(loggerSpy).toHaveBeenCalledOnce();
      expect(writerSpy).toHaveBeenCalledTimes(5);
    });
  });
});
