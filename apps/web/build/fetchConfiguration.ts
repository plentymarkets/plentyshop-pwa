import axios from 'axios';
import https from 'node:https';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, '../.env'),
});

const environmentFilePath = path.resolve(__dirname, '../.env');
const environmentTemporaryFilePath = path.resolve(__dirname, '../.env.tmp');

const environmentMap = {
  FETCH_REMOTE_CONFIG: process.env.FETCH_REMOTE_CONFIG,
  API_ENDPOINT: process.env.API_ENDPOINT,
  API_SECURITY_TOKEN: process.env.API_SECURITY_TOKEN,
  CONFIG_ID: process.env.CONFIG_ID,
};

const setupTemporaryEnvironment = () => {
  let requiredEnvironmentData = '';

  for (const [key, value] of Object.entries(environmentMap)) {
    requiredEnvironmentData += `${key}=${value}\n`;
    if (key === 'FETCH_REMOTE_CONFIG') continue;
    if (!value) {
      console.error(`Missing or invalid required environment variable: ${key}`);
      return;
    }
  }

  fs.writeFile(environmentTemporaryFilePath, requiredEnvironmentData, () => {});
};

const writeConfigurationToTemporaryEnvironment = (data: Array<Array<{ [key: string]: string }>>) => {
  console.log('Writing remote configuration to temporary environment file...');
  const environmentVariables = fs.readFileSync(environmentTemporaryFilePath, 'utf8').split(os.EOL);

  for (const category in data) {
    if (Array.isArray(data[category])) {
      data[category].forEach((item: { [key: string]: string }) => {
        environmentVariables.push(`${item.key.toUpperCase()}="${item.value}"`);
      });
    }
  }

  fs.writeFileSync(environmentTemporaryFilePath, environmentVariables.join(os.EOL));

  console.log('Remote configuration written to temporary environment file.');
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
    const { data } = await instance.get(`/rest/storefront/settings/${environmentMap.CONFIG_ID}`);
    writeConfigurationToTemporaryEnvironment(data);
    return data;
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
  setupTemporaryEnvironment();
  const data = await fetchAndWriteRemoteConfiguration();
  convertTemporaryToPermanentEnvironment();
  return data;
};

export default fetchConfiguration;
