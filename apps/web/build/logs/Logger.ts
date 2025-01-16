import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { WriteStream } from 'node:fs';
import { createWriteStream } from 'node:fs';
import type { Logger } from './types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class BuildLogger implements Logger {
  private static instance: Logger;
  private logStream: WriteStream;

  constructor() {
    const timestamp = new Date().toISOString().replaceAll(':', '-');
    const logFilePath = path.resolve(__dirname, `./build-${timestamp}.log`);
    this.logStream = createWriteStream(logFilePath);
  }

  public static getInstance(): Logger {
    if (!BuildLogger.instance) {
      BuildLogger.instance = new BuildLogger();
    }

    return BuildLogger.instance;
  }

  private formatMessage(level: string, message: string): string {
    return `[${level}] ${message}`;
  }

  info(message: string): void {
    const formattedMessage = this.formatMessage('INFO', message);
    // eslint-disable-next-line no-console
    console.log(formattedMessage);
    this.logStream.write(`${formattedMessage}\n`);
  }

  warn(message: string): void {
    const formattedMessage = this.formatMessage('WARN', message);
    console.warn(formattedMessage);
    this.logStream.write(`${formattedMessage}\n`);
  }

  error(message: string, error?: Error): void {
    const formattedMessage = this.formatMessage('ERROR', message);
    console.error(formattedMessage);
    if (error) {
      console.error(error.stack);
      this.logStream.write(`${formattedMessage}\n${error.stack}\n`);
    } else {
      this.logStream.write(`${formattedMessage}\n`);
    }
  }
}

export const BuildLoggerInstance = BuildLogger.getInstance();
