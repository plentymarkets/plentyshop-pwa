import { SystemConfiguration } from './configurator/SystemConfiguration';
import { AppConfigurator } from './configurator/AppConfigurator';
import { AssetDownloader } from './configurator/AssetDownloader';

if (process.env.FETCH_REMOTE_CONFIG === '1') {
  console.log('Fetching remote configuration...');
  const systemConfiguration = new SystemConfiguration();
  await systemConfiguration.fetch();

  const appConfigurator = new AppConfigurator();
  appConfigurator.generateScssVariables(systemConfiguration.getBaseColors());

  const assetDownloader = new AssetDownloader();
  await assetDownloader.downloadFavicon(systemConfiguration.getFaviconUrl());
  await assetDownloader.downloadLogo(systemConfiguration.getLogoUrl());
} else {
  console.warn(`Fetching PWA settings is disabled! Set FETCH_REMOTE_CONFIG in .env file.`);
}
