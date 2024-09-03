import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { SystemConfiguration } from './configurator/SystemConfiguration';
import { AppConfigurator } from './configurator/AppConfigurator';
import { AssetDownloader } from './configurator/AssetDownloader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const main = async () => {
  if (process.env.FETCH_REMOTE_CONFIG === '1') {
    console.log('Fetching remote configuration...');
    const systemConfiguration = new SystemConfiguration();
    await systemConfiguration.fetch();

    const appConfigurator = new AppConfigurator();
    appConfigurator.generateEnvironment(systemConfiguration.getResponse());
    appConfigurator.generateScssVariables(systemConfiguration.getBaseColors());

    const assetDownloader = new AssetDownloader();
    await assetDownloader.downloadFavicon(systemConfiguration.getFaviconUrl());
    await assetDownloader.downloadLogo(systemConfiguration.getLogoUrl());
  } else {
    console.warn(`Fetching PWA settings is disabled! Set FETCH_REMOTE_CONFIG in .env file.`);
  }
};

await main().catch((error: unknown) => {
  console.error('An error occurred:', error);
});
