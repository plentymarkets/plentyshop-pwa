import axios from 'axios';
import https from 'https';
import fs from 'fs';
import os from 'os';
import path from 'path';

const envFilePath = path.resolve(__dirname, "../.env");

// read .env file & convert to array
const readEnvVars = () => fs.readFileSync(envFilePath, "utf-8").split(os.EOL);

const getEnvValue = (key: string) => {
  // find the line that contains the key (exact match)
  const matchedLine = readEnvVars().find((line) => line.split("=")[0] === key);
  // split the line (delimiter is '=') and return the item at index 2
  return matchedLine !== undefined ? matchedLine.split("=")[1] : null;
};

const setEnvValue = (key: string, value: string) => {
  const envVars = readEnvVars();
  const targetLine = envVars.find((line) => line.split("=")[0] === key);
  if (targetLine !== undefined) {
    // update existing line
    const targetLineIndex = envVars.indexOf(targetLine);
    // replace the key/value with the new value
    envVars.splice(targetLineIndex, 1, `${key.toUpperCase()}="${value}"`);
  } else {
    // create new key value
    envVars.push(`${key.toUpperCase()}="${value}"`);
  }
  // write everything back to the file system
  fs.writeFileSync(envFilePath, envVars.join(os.EOL));
};


const getConfiguration = () => {
  const instance = axios.create({
    withCredentials: true,
    baseURL: process.env.API_ENDPOINT,
    headers: {
      'X-Security-Token': process.env.API_SECURITY_TOKEN
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false
    })
  });

  // What we can do for Cert issue (rejectUnauthorized was one solution)
  // The .env keeps restarting because we write data in it (creating something close to an infinite loop - ".env changed, restarting server...")
  // Solution 1 - Create a temporary .env file (.env.tmp) then change the name to .env
  // Disable the .env check from nodemon.json ("ignore": [".env"])

  instance
    .get('/storefront/settings/1')
    .then(result => {
      const data = result.data;
      for (const category in data) {
        if (Array.isArray(data[category])) {
          data[category].forEach((item: any) => {
            setEnvValue(item.key, item.value);
            console.log(item.key, item.value);
          })
        }
      }
    })
    .catch(error => {
      console.log('Catch ->', error);
    })
};

export default getConfiguration