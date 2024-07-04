import axios from 'axios';
import https from 'node:https';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const environmentFilePath = path.resolve(__dirname, '../.env');
const environmentTemporaryFilePath = path.resolve(__dirname, '../.env.tmp');

const environmentMap = {
  DISABLE_SETTINGS_FETCH: process.env.DISABLE_SETTINGS_FETCH,
  API_ENDPOINT: process.env.API_ENDPOINT,
  API_SECURITY_TOKEN: process.env.API_SECURITY_TOKEN,
  CONFIG_ID: process.env.CONFIG_ID,
};

const setupTemporaryEnvironment = () => {
  let requiredEnvironmentData = '';

  for (const [key, value] of Object.entries(environmentMap)) {
    if (key !== 'DISABLE_SETTINGS_FETCH' && !value) {
      console.error(`Missing or invalid required environment variable: ${value}`);
      return;
    }

    requiredEnvironmentData += `${key}=${value}\n`;
  }

  fs.writeFile(environmentTemporaryFilePath, requiredEnvironmentData, () => {});
};

const writeConfigurationToTemporaryEnvironment = (data: Array<Array<{ [key: string]: string }>>) => {
  const environmentVariables = fs.readFileSync(environmentTemporaryFilePath, 'utf8').split(os.EOL);

  for (const category in data) {
    if (Array.isArray(data[category])) {
      data[category].forEach((item: { [key: string]: string }) => {
        environmentVariables.push(`${item.key.toUpperCase()}="${item.value}"`);
      });
    }
  }

  fs.writeFileSync(environmentTemporaryFilePath, environmentVariables.join(os.EOL));
};

const fetchAndWriteRemoteConfiguration = async () => {
  const instance = axios.create({
    withCredentials: true,
    baseURL: environmentMap.API_ENDPOINT,
    headers: {
      'X-Security-Token': environmentMap.API_SECURITY_TOKEN,
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
    }),
  });

  try {
    const { data } = await instance.get(`/storefront/settings/${environmentMap.CONFIG_ID}`);
    writeConfigurationToTemporaryEnvironment(data);
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error('PWA settings error:', error.response?.data.error);
      return;
    }
  }
};

const convertTemporaryToPermanentEnvironment = () => {
  fs.copyFile(environmentTemporaryFilePath, environmentFilePath, () => {});
  fs.unlink(environmentTemporaryFilePath, () => {});
};

const fetchConfiguration = async () => {
  if (environmentMap.DISABLE_SETTINGS_FETCH === 'undefined' || environmentMap.DISABLE_SETTINGS_FETCH === '0') {
    console.warn(`Fetching PWA settings is disabled! Check DISABLE_SETTINGS_FETCH in .env file.`);
    return;
  }

  setupTemporaryEnvironment();
  fetchAndWriteRemoteConfiguration();
  convertTemporaryToPermanentEnvironment();
};

export default fetchConfiguration;
