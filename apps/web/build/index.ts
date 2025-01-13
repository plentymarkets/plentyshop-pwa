import dotenv from 'dotenv';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SystemConfiguration } from './configurator/SystemConfiguration';
import { AppConfigurator } from './configurator/AppConfigurator';
import { AssetDownloader } from './configurator/AssetDownloader';
import { CdnToFileWriter } from './writers/CdnToFileWriter';
import { DataToFileWriter } from './writers/DataToFileWriter';
import { BuildLoggerInstance } from './logs/Logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const main = async () => {
  if (process.env.FETCH_REMOTE_CONFIG === '1') {
    BuildLoggerInstance.info('Fetching remote configuration...');
    const systemConfiguration = new SystemConfiguration();
    await systemConfiguration.fetch();

    const dataWriter = new DataToFileWriter(BuildLoggerInstance);
    const appConfigurator = new AppConfigurator(dataWriter, BuildLoggerInstance);
    appConfigurator.generateEnvironment(systemConfiguration.getResponse());
    appConfigurator.generateScssVariables(systemConfiguration.getBaseColors());
    appConfigurator.generateLanguageFiles(systemConfiguration.getLanugages());

    const cdnWriter = new CdnToFileWriter(BuildLoggerInstance);
    const assetDownloader = new AssetDownloader(cdnWriter, BuildLoggerInstance);
    assetDownloader.downloadFavicon(systemConfiguration.getFaviconUrl());
    assetDownloader.downloadLogo(systemConfiguration.getLogoUrl());
  } else {
    BuildLoggerInstance.warn(`Fetching PWA settings is disabled! Set FETCH_REMOTE_CONFIG in .env file.`);
  }
};

await main().catch((error: Error) => {
  BuildLoggerInstance.error('An error occurred:', error);
});
