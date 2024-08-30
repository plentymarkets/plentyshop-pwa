import dotenv from 'dotenv';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fetchConfiguration from './fetchConfiguration';
import fetchFavicon from './fetchFavicon';
import fetchLogo from './fetchLogo';
import generateScssVariables from './generateScssVariables';
import { ConfigurationResponse } from './types/ConfigurationResponse';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const findValueInResponseByKey = (response: ConfigurationResponse, category: string, key: string) => {
  const foundEntry = response[category].find((entry) => entry.key === key);
  return foundEntry ? foundEntry.value : '';
};

// eslint-disable-next-line no-console
console.log('Fetching remote configuration...');

if (process.env.FETCH_REMOTE_CONFIG === '1') {
  const response = await fetchConfiguration();
  generateScssVariables(
    findValueInResponseByKey(response, 'styling', 'primary'),
    findValueInResponseByKey(response, 'styling', 'secondary'),
  );
  await fetchFavicon(response);
  await fetchLogo(response);
} else {
  console.warn(`Fetching PWA settings is disabled! Set FETCH_REMOTE_CONFIG in .env file.`);
}