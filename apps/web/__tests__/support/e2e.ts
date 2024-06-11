import 'cypress-real-events';
import './commands';
import failOnConsoleError, { type Config } from 'cypress-fail-on-console-error';
import './failOnError';

const config: Config = {
  consoleTypes: ['error', 'warn'],
};

failOnConsoleError(config);