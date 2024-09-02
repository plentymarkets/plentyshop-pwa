import dotenv from 'dotenv';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fetchConfiguration from './fetchConfiguration';
import { fetchFavicon } from './fetchFavicon';
import { fetchLogo } from './fetchLogo';
import generateScssVariables from './generateScssVariables';
import { ConfigurationResponse } from './types/ConfigurationResponse';
import { LocalToFileWriter } from './classes/LocalToFileWriter';
import { CdnToFileWriter } from './classes/CdnToFileWriter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const findValueInResponseByKey = (response: ConfigurationResponse, category: string, key: string) => {
  const foundEntry = response[category].find((entry) => entry.key === key);
  return foundEntry ? foundEntry.value : '';
};

console.log('Fetching remote configuration...');

if (process.env.FETCH_REMOTE_CONFIG === '1') {
  const response = await fetchConfiguration();

  generateScssVariables(
    {
      primary: findValueInResponseByKey(response, 'styling', 'primary'),
      secondary: findValueInResponseByKey(response, 'styling', 'secondary'),
    },
    new LocalToFileWriter(),
  );

  await fetchFavicon(findValueInResponseByKey(response, 'store', 'favicon'), new CdnToFileWriter());

  await fetchLogo(findValueInResponseByKey(response, 'store', 'logo'), new CdnToFileWriter());
} else {
  console.warn(`Fetching PWA settings is disabled! Set FETCH_REMOTE_CONFIG in .env file.`);
}
