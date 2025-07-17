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
  const configKeys = [
    'NUXT_PUBLIC_PRIMARY_COLOR',
    'NUXT_PUBLIC_SECONDARY_COLOR',
    'NUXT_PUBLIC_BUNDLE_ITEM_DISPLAY',
    'DEFAULTLANGUAGE',
    'LANGUAGELIST',
    'LOGO',
    'FAVICON',
  ];

  const config = configKeys.reduce(
    (configAccumulator, key) => {
      configAccumulator[key] = process.env[key];
      return configAccumulator;
    },
    {} as Record<string, string | undefined>,
  );

  if (process.env.FETCH_REMOTE_CONFIG === '1') {
    BuildLoggerInstance.info('Configuring application...');
    const systemConfiguration = new SystemConfiguration(config);

    const dataWriter = new DataToFileWriter(BuildLoggerInstance);
    const appConfigurator = new AppConfigurator(dataWriter, BuildLoggerInstance);
    appConfigurator.generateLanguageFiles(systemConfiguration.getLanguages());

    const cdnWriter = new CdnToFileWriter(BuildLoggerInstance);
    const assetDownloader = new AssetDownloader(cdnWriter, BuildLoggerInstance);
    assetDownloader.downloadFavicon(systemConfiguration.getFaviconUrl());
  } else {
    BuildLoggerInstance.warn(`Fetching PWA settings is disabled! Set FETCH_REMOTE_CONFIG in .env file.`);
  }
};

await main().catch((error: Error) => {
  BuildLoggerInstance.error('An error occurred:', error);
});
